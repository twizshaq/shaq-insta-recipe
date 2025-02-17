import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Missing 'query' parameter in request URL" },
      { status: 400 }
    );
  }

  try {
    const apiParameters = {
      options: {
        query: query,
        scope: "pins",
        page_size: 6,
        rs: "typed",
        auto_correction_disabled: "false",
        source_id: "7",
        recipe_pin: "true",
        search_match_strategy: "both",
        query_suggestions: "true",
        enable_visual_search: "false",
      },
    };

    const pinterestResponse = await fetch(
      `https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(
        JSON.stringify(apiParameters)
      )}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
          Referer: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    if (!pinterestResponse.ok) {
      const errorText = await pinterestResponse.text();
      throw new Error(
        `Pinterest API request failed (${pinterestResponse.status}): ${errorText}`
      );
    }

    const pinterestData = await pinterestResponse.json();

    console.log("Full Pinterest response:", JSON.stringify(pinterestData, null, 2));

    const pins = pinterestData.resource_response?.data?.results || [];

    console.log("Number of pins returned:", pins.length);

    const images = pins
      .filter((pin: any) => Boolean(pin?.images?.orig?.url))
      .map((pin: any) => ({
        url: pin.images.orig.url,
        alt: pin.description || `${query} recipe`,
      }));

    if (images.length === 0) {
      console.warn("No valid images found in Pinterest response.");
      return NextResponse.json({
        images: [],
        warning: "No images found. See server logs for debugging info.",
      });
    }

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("Pinterest API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch images",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
