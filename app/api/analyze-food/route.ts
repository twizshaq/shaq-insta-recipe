import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
    try {
        const { images = [], userDescription } = await request.json();

        if (!images?.length && !userDescription?.trim()) {
            return NextResponse.json(
                { error: "Please provide either images or a description." },
                { status: 400 }
            );
        }

        const systemInstruction = {
            parts: [
                {
                    text: `You are a food expert. Analyze food images and descriptions to:
                        1. Identify the dish name.
                        2. Provide a 50-60 word description including:
                        - Cultural origin
                        - Key ingredients
                        - Typical preparation method
                        - Serving suggestions.
                        3. List ingredients:
                            - One ingredient per line
                            - Include measurements
                            - Note alternatives for dietary restrictions
                        4. Format instructions:
                            - Numbered steps (using a single, continuous sequence: 1, 2, 3...10, 11, 12, etc.)
                            - Step title in **bold**
                            - One step per line
                            - Exact temperatures (°F/°C)
                            - Cooking durations
                            - Include NO extra text before the number.
                        5. Format response *exactly* as:
                        DISH NAME: [name]
                        DESCRIPTION: [text]

                        INGREDIENTS:
                        [line1]
                        [line2]
                        ...

                        INSTRUCTIONS:
                        [step1]
                        [step2]
                        ...`
                }
            ]
        };

        const contents = [
            {
                role: "user",
                parts: [
                    { text: userDescription || "Please analyze this food." },
                    ...images.map((base64Image: string) => ({
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image.split(",")[1]
                        }
                    }))
                ]
            }
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-exp-02-05:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction,
                    contents,
                    generationConfig: {
                        maxOutputTokens: 2000,
                        temperature: 0.4,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json(
                { error: errorData.error?.message || "Food analysis failed." },
                { status: 500 }
            );
        }

        const result = await response.json();
        const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Raw Gemini Response:", textResponse);

        if (!textResponse) {
            return NextResponse.json(
                { error: "Invalid response from Gemini." },
                { status: 500 }
            );
        }

        const dishRegex = /DISH NAME:\s*(.+?)\s*DESCRIPTION:\s*([\s\S]+?)\s*INGREDIENTS:\s*([\s\S]+?)\s*INSTRUCTIONS:\s*([\s\S]+)/i;

        const match = textResponse.match(dishRegex);

        if (match) {
            // Process ingredients
            const ingredients = match[3].trim()
                .split('\n')
                .map((line: string) => line.trim())
                .filter((line: string) => line.length > 0);

            // Process instructions
            const instructionSteps: { number: string; title: string; description: string; }[] = [];
            const instructionsText = match[4]?.trim();

            if (instructionsText) {
                console.log("Instructions text to parse:", instructionsText);

                const instructionRegex = /^(\d+)\.\s*\*\*(.*?)\*\*\s*([\s\S]*?)(?=(\d+\.|\s*$))/gm;
                let instructionMatch;

                while ((instructionMatch = instructionRegex.exec(instructionsText)) !== null) {
                    instructionSteps.push({
                        number: instructionMatch[1].trim(),
                        title: instructionMatch[2].trim(),
                        description: instructionMatch[3].trim().replace(/\n/g, ' '),
                    });
                }

                // Fallback (less strict)
                if (instructionSteps.length === 0) {
                    console.warn("No instruction steps matched, using fallback parsing");
                    const lines = instructionsText.split('\n').filter((line: string) => line.trim().length > 0);

                    for (const line of lines) {
                        const stepMatch = line.match(/^\s*(\d+)\.\s*(.*)/);
                        if (stepMatch) {
                            instructionSteps.push({
                                number: stepMatch[1],
                                title: `Step ${stepMatch[1]}`,
                                description: stepMatch[2].trim(),
                            });
                        }
                    }
                }
            }

            return NextResponse.json({
                name: match[1].trim() || "Unknown Dish",
                description: match[2].trim() || "No description available",
                ingredients: ingredients,
                instructions: instructionSteps
            });

        } else {
            console.log("Fallback parsing triggered");
            const nameMatch = textResponse.match(/DISH NAME:\s*(.+)/i);
            const descriptionMatch = textResponse.match(/DESCRIPTION:\s*([\s\S]+?)(?:\n\n|\z)/i);
            const ingredientsMatch = textResponse.match(/INGREDIENTS:\s*([\s\S]+?)(?:\n\n|\z)/i);
            const instructionsMatch = textResponse.match(/INSTRUCTIONS:\s*([\s\S]+)/i);

            let ingredients: string[] = [];
            if (ingredientsMatch) {
                ingredients = ingredientsMatch[1].trim().split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
            }

            let instructions: { number: string; title: string; description: string; }[] = [];
            if (instructionsMatch) {
                const instructionText = instructionsMatch[1].trim();
                const instructionRegex = /^(\d+)\.\s*\*\*(.*?)\*\*\s*([\s\S]*?)(?=(\d+\.|\s*$))/gm;
                let instructionMatch;

                while ((instructionMatch = instructionRegex.exec(instructionText)) !== null) {
                instructions.push({
                    number: instructionMatch[1].trim(),
                    title: instructionMatch[2].trim(),
                    description: instructionMatch[3].trim().replace(/\n/g, ' '),
                    });
                }

                // Fallback for instructions if primary regex fails
                if(instructions.length === 0){
                    const lines = instructionText.split('\n').filter((line: string) => line.trim().length > 0);
                    for (const line of lines) {
                        const stepMatch = line.match(/^\s*(\d+)\.\s*(.*)/);
                        if (stepMatch) {
                            instructions.push({
                                number: stepMatch[1],
                                title: `Step ${stepMatch[1]}`,
                                description: stepMatch[2].trim(),
                            });
                        }
                    }
                }
            }

            return NextResponse.json({
                name: nameMatch ? nameMatch[1].trim() : "Unknown Dish",
                description: descriptionMatch ? descriptionMatch[1].trim() : "No description",
                ingredients: ingredients,
                instructions: instructions,
            });
        }
    } catch (error) { 
        console.error("An unexpected error occurred:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}