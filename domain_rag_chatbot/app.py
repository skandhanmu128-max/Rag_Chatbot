import streamlit as st
import os
import io
import speech_recognition as sr
from gtts import gTTS
from document_loader import process_pdf
from vector_store import create_vector_store
from rag_pipeline import answer_query
from dotenv import load_dotenv
from audio_recorder_streamlit import audio_recorder

# Load env variables (API key from .env)
load_dotenv()

st.set_page_config(page_title="Domain-Specific RAG Chatbot", layout="wide")

# Initialize session state variables
if "messages" not in st.session_state:
    st.session_state.messages = []
if "vector_store" not in st.session_state:
    st.session_state.vector_store = None
if "raw_chunks" not in st.session_state:
    st.session_state.raw_chunks = None

def generate_audio(text):
    try:
        tts = gTTS(text, lang='en')
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp
    except Exception as e:
        return None

# --- Sidebar ---
with st.sidebar:
    st.title("Settings & Documents")
    
    # File Uploader
    uploaded_files = st.file_uploader(
        "Upload PDF Documents", 
        type=["pdf"], 
        accept_multiple_files=True
    )
    
    # Process Button
    if st.button("Process Documents", use_container_width=True):
        if not uploaded_files:
            st.error("Please upload at least one PDF.")
        else:
            with st.spinner("Processing and building vector store..."):
                try:
                    documents = process_pdf(uploaded_files)
                    
                    if not documents:
                        st.error("Could not extract any text from the uploaded PDFs.")
                    else:
                        vs, chunks = create_vector_store(documents)
                        st.session_state.vector_store = vs
                        st.session_state.raw_chunks = chunks
                        
                        file_names = ", ".join([f.name for f in uploaded_files])
                        st.success(f"Successfully processed {len(chunks)} chunks from: {file_names}")
                except Exception as e:
                    st.error(f"Error processing documents: {e}")
                    
    st.divider()
    
    # Visualizing Chunks
    if st.session_state.raw_chunks:
        with st.expander("🔍 View Extracted Document Chunks"):
            st.write(f"Total Chunks: {len(st.session_state.raw_chunks)}")
            for i, chunk in enumerate(st.session_state.raw_chunks):
                st.markdown(f"**Chunk {i+1}** (Page {chunk.metadata.get('page')})")
                st.info(chunk.page_content)
    
    st.divider()
    if st.button("Clear Chat", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

# --- Main Panel ---
st.title("Domain-Specific RAG Chatbot 📄🎙️")
st.info("Answers are generated purely from uploaded documents. You can type or use the microphone to speak your question!")

# Render Chat History
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if message.get("sources"):
            with st.expander("View Sources"):
                for src in message["sources"]:
                    st.markdown(f"- **File**: {src.get('source', 'N/A')} | **Page**: {src.get('page', 'N/A')}")
        if message.get("audio"):
            st.audio(message["audio"], format="audio/mp3")

# Layout for chat input and microphone
col1, col2 = st.columns([10, 1])

with col1:
    prompt = st.chat_input("Ask a question about your documents...")

with col2:
    # Audio recorder returns bytes when recording is done
    audio_bytes = audio_recorder(text="", icon_size="2x", icon_name="microphone", key="mic")

# Handle input (either text or voice)
user_query = None

if prompt:
    user_query = prompt
elif audio_bytes:
    # Transcribe audio using SpeechRecognition
    try:
        r = sr.Recognizer()
        with sr.AudioFile(io.BytesIO(audio_bytes)) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data)
            user_query = text
    except Exception as e:
        st.error(f"Could not recognize speech: {e}")

if user_query:
    # Append user message to state and display
    st.session_state.messages.append({"role": "user", "content": user_query})
    with st.chat_message("user"):
        st.markdown(user_query)
        
    # Generate Assistant Response
    with st.chat_message("assistant"):
        if not st.session_state.vector_store:
            st.warning("Please upload and process documents first.")
            st.session_state.messages.append({"role": "assistant", "content": "Please upload and process documents first.", "sources": []})
        else:
            active_api_key = os.getenv("GEMINI_API_KEY")
            if not active_api_key:
                st.warning("Gemini API key is missing from .env.")
                st.session_state.messages.append({"role": "assistant", "content": "Gemini API key is missing.", "sources": []})
            else:
                with st.spinner("Thinking..."):
                    result = answer_query(st.session_state.vector_store, user_query, api_key=active_api_key)
                    answer = result["answer"]
                    sources = result["sources"]
                    
                    st.markdown(answer)
                    if sources:
                        with st.expander("View Sources"):
                            for src in sources:
                                st.markdown(f"- **File**: {src.get('source', 'N/A')} | **Page**: {src.get('page', 'N/A')}")
                    
                    # Generate TTS Audio
                    audio_fp = generate_audio(answer)
                    if audio_fp:
                        st.audio(audio_fp, format="audio/mp3")
                        
                    st.session_state.messages.append({
                        "role": "assistant", 
                        "content": answer,
                        "sources": sources,
                        "audio": audio_fp
                    })
