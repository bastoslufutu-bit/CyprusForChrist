import requests
from django.conf import settings

class BiblicalAIService:
    @staticmethod
    def ask_bible(question, language='fr'):
        # Configuration of the system prompt based on language
        if language == 'en':
            system_prompt = (
                "You are a spiritual and biblical assistant for the 'Cyprus For Christ' platform. "
                "Your answers must be based on the Bible, with a pastoral, caring, and encouraging tone. "
                "If a question is not spiritual or biblical, politely try to steer the conversation back to faith. "
                "Use Bible verses to support your answers. Answer in English (King James Version style if appropriate)."
            )
        else:
            system_prompt = (
                "Tu es un assistant spirituel et biblique pour la plateforme 'Cyprus For Christ'. "
                "Tes réponses doivent être basées sur la Bible, avec un ton pastoral, bienveillant, et encourageant. "
                "Si une question n'est pas spirituelle ou biblique, essaie de ramener poliment la conversation vers la foi. "
                "Utilise des versets bibliques pour appuyer tes réponses. Réponds en français."
            )

        try:
            if not settings.GEMINI_API_KEY:
                 return "Erreur de configuration : La clé API Google Gemini est manquante."

            # Use Gemini REST API directly (v1beta endpoint_
            # Update to gemini-flash-latest to better handle free tier limits and availability
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={settings.GEMINI_API_KEY}"
            
            # Construct the full prompt with context
            full_prompt = f"{system_prompt}\n\nQuestion de l'utilisateur: {question}"
            
            payload = {
                "contents": [{
                    "parts": [{"text": full_prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048
                }
            }
            
            # Simple retry mechanism for 429 errors
            import time
            max_retries = 3
            for attempt in range(max_retries):
                response = requests.post(url, json=payload, timeout=30)
                
                if response.status_code == 200:
                    data = response.json()
                    # Debug logging
                    print(f"Gemini API Response: {data}")
                    
                    if 'candidates' in data and len(data['candidates']) > 0:
                        candidate = data['candidates'][0]
                        answer_text = ""
                        
                        # Try to get text even if interrupted
                        if 'content' in candidate and 'parts' in candidate['content']:
                            answer_text = candidate['content']['parts'][0]['text']
                        
                        if 'finishReason' in candidate and candidate['finishReason'] != 'STOP':
                            if answer_text:
                                return f"{answer_text}\n\n[Note: La réponse a été interrompue ({candidate['finishReason']})]"
                            else:
                                return f"La réponse a été interrompue. Raison: {candidate['finishReason']}"
                        
                        if answer_text:
                            return answer_text
                        else:
                            return "Désolé, la réponse de l'IA est vide ou illisible."
                    else:
                        return "Désolé, je n'ai pas pu générer de réponse (Aucun candidat)."
                elif response.status_code == 429:
                    # Rate limit hit
                    if attempt < max_retries - 1:
                        time.sleep(2 * (attempt + 1)) # Backoff: 2s, 4s...
                        continue
                    else:
                        return "Le service est actuellement surchargé (limite de quota). Veuillez réessayer dans quelques instants."
                else:
                    print(f"Gemini API Error: {response.status_code} - {response.text}")
                    return f"Erreur API ({response.status_code}): {response.text}"
            
        except Exception as e:
            print(f"Gemini Service Exception: {str(e)}")
            import traceback
            traceback.print_exc()
            return f"Désolé, je rencontre une difficulté technique pour répondre : {str(e)}"

    @staticmethod
    def generate_daily_rhema():
        """Génère un Rhema du jour complet (Titre, Verset, Contenu, Méditation)"""
        prompt = (
            "Tu es un pasteur inspiré. Génère le 'Rhema du Jour' pour aujourd'hui. "
            "Réponds UNIQUEMENT avec un objet JSON au format suivant : "
            "{"
            "  \"title\": \"Titre inspirant\", "
            "  \"verse\": \"Référence Biblique (ex: Jean 3:16)\", "
            "  \"content\": \"La Parole de Dieu ou le verset complet\", "
            "  \"meditation\": \"Une courte méditation ou encouragement pastoral (2-3 phrases)\""
            "}"
            "Le contenu doit être profond, encourageant et spirituel."
        )

        try:
            if not settings.GEMINI_API_KEY:
                return None

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={settings.GEMINI_API_KEY}"
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.8,
                    "maxOutputTokens": 1024,
                    "responseMimeType": "application/json"
                }
            }
            
            response = requests.post(url, json=payload, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    import json
                    text = data['candidates'][0]['content']['parts'][0]['text']
                    return json.loads(text)
            return None
        except Exception as e:
            print(f"Error generating AI Rhema: {e}")
            return None
