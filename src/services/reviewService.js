
const API_URL = process.env.REACT_APP_API_URL;

export async function runArchitectureReview(payload) {
  if (!API_URL) {
    throw new Error(
      "Backend API URL is not configured."
    );
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch(
      `${API_URL}/architecture/review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "Too many requests. Please try again later."
        );
      }

      if (response.status >= 500) {
        throw new Error(
          "The review server is temporarily unavailable."
        );
      }

      throw new Error(
        `Architecture review failed (${response.status}).`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The review request timed out. Please try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
