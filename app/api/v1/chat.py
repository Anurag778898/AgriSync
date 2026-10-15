import os
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import ChatRequest, ChatResponse
from google import genai
from google.genai.errors import APIError

router = APIRouter(prefix="/api/v1/chat", tags=["AI Chat"])

@router.post("", response_model=ChatResponse)
@router.post("/", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "your_actual_api_key_here":
        return ChatResponse(
            response="🌾 <strong>AgriSync Agronomic AI Assistant (Demo Mode)</strong><br><br>"
                     "Your chat connection is working! To activate live Gemini AI responses, add your <code>GEMINI_API_KEY</code> to the <code>.env</code> file.<br><br>"
                     "<em>Advisory Preview for '" + request.message + "':</em><br>"
                     "• Check soil moisture levels and ensure drainage before upcoming rain.<br>"
                     "• Monitor local APMC mandi arrivals for favorable price windows.<br>"
                     "• Apply scheduled micronutrients during cooler evening hours."
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
