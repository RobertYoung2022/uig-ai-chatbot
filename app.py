import os
import streamlit as st
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# Load environment variables
load_dotenv()

# Initialize Streamlit state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

def load_documents():
    """Load and process documents from the data directory"""
    with open("data/tech-analy-uig.md", "r") as f:
        text = f.read()
    
    # Split text into chunks
    text_splitter = CharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separator="\n"
    )
    chunks = text_splitter.create_documents([text])
    return chunks

def initialize_chain():
    """Initialize the conversational chain with ChromaDB and OpenAI"""
    # Create embeddings and vector store
    embeddings = OpenAIEmbeddings()
    chunks = load_documents()
    
    # Create or load the vector store
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./data/chromadb"
    )
    vectorstore.persist()
    
    # Create memory and chain
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )
    
    # Initialize the conversation chain
    chain = ConversationalRetrievalChain.from_llm(
        llm=ChatOpenAI(temperature=0.7, model="gpt-4"),
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        memory=memory,
        return_source_documents=True,
        verbose=True
    )
    
    return chain

# Streamlit UI
st.title("🌊 DeFi Correlation Coach")
st.write("Ask me anything about crypto correlations and DeFi investing! I'm here to help you understand how different assets move together and how to use this knowledge in your investment strategy.")

# Initialize the chain
if "chain" not in st.session_state:
    st.session_state.chain = initialize_chain()

# Chat input
if query := st.chat_input("What would you like to know about crypto correlations?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": query})
    
    # Get the response from the chain
    response = st.session_state.chain({"question": query})
    answer = response["answer"]
    
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": answer})

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"]) 