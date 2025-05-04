/**
 * Fetches structured data about the portfolio owner from GitHub
 * with caching for 10 minutes (600 seconds)
 *
 * @returns {Promise<Array>} Array of folder objects or null if error
 */
export async function fetchAboutAsync() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/RazvanBordinc/about-me/main/me-structured.json",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 6000 },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return null;
  }
}
