import os
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import ChatRequest, ChatResponse
from google import genai
from google.genai.errors import APIError

router = APIRouter(prefix="/chat", tags=["AI Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "your_actual_api_key_here":
        raise HTTPException(
            status_code=500, 
            detail="The Gemini API key is missing or not configured correctly in the .env file."
        )

    try:
        client = genai.Client(api_key=api_key)
        
        system_prompt = (
            "You are the AgriSync AI Assistant. You help Indian farmers "
            "with agricultural advice, market pricing, weather forecasting, and crop planning. "
            "Keep your answers concise, practical, and highly relevant to Indian agriculture. "
            "Format your response in simple HTML if needed (e.g. using <strong> for bold, <br> for newlines)."
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.message,
            config=genai.types.GenerateContentConfig(
                system_instruction=system_prompt,
            )
        )
        
        return ChatResponse(response=response.text)
        
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
