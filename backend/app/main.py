from fastapi import FastAPI

app = FastAPI(
    title="LLM Cost Autopilot API",
    description="AI-powered LLM cost optimization platform",
    version="1.0.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LLM Cost Autopilot",
    }