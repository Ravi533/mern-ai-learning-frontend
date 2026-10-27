
import { useState } from "react";
import "../../src/App.css"
import { useSelector } from "react-redux";

function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
const [uploadingPdf, setUploadingPdf] = useState(false);
const [pdfStatus, setPdfStatus] = useState("");


  const {  user } = useSelector(
    (state) => state.auth
  );

//   const sendMessage = async (event) => {
//     event.preventDefault();

//     const trimmedQuestion = question.trim();

//     if (!trimmedQuestion || loading) return;

//     // Display the user's message immediately
//     setMessages((previous) => [
//       ...previous,
//       { role: "user", content: trimmedQuestion },
//     ]);

//     setQuestion("");
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5001/api/ai/chat",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             question: trimmedQuestion,
//             userName: user.name
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to get a response");
//       }

//       // Display the AI response
//       setMessages((previous) => [
//         ...previous,
//         { role: "assistant", content: data.answer },
//       ]);
//     } catch (error) {
//       setMessages((previous) => [
//         ...previous,
//         {
//           role: "assistant",
//           content: `Error: ${error.message}. Check whether the backend is running.`,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };



const handlePdfUpload = async (event) => {
    event.preventDefault();
  
    if (!pdfFile || uploadingPdf) return;
  
    setUploadingPdf(true);
    setPdfStatus("Uploading PDF and generating embeddings...");
  
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
  
      const response = await fetch(
        "http://localhost:5001/api/pdf/upload",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "PDF upload failed");
      }
  
      setPdfStatus(
        `Successfully processed ${data.fileName}. ` +
        `${data.totalChunks} chunks created, with ` +
        `${data.embeddingDimensions}-dimensional embeddings.`
      );
    } catch (error) {
      console.error("PDF upload error:", error);
      setPdfStatus(`Upload failed: ${error.message}`);
    } finally {
      setUploadingPdf(false);
    }
  };

  

const handleSendMessage = async (event) => {
    event.preventDefault();
  
    const trimmedQuestion = question.trim();
  
    if (!trimmedQuestion || loading) return;
  
    // Show the user's message immediately
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);
  
    setQuestion("");
    setLoading(true);
  
    try {
      const response = await fetch(
        "http://localhost:5001/api/pdf/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: trimmedQuestion,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get an answer"
        );
      }
  
      // Show the AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      console.error("RAG API error:", error);
  
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: `Sorry, I couldn't get an answer: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="app">
      <div className="chat-card">
        <header className="chat-header">
          <div>
            <h1>AI Assistant</h1>
            <p>Ask me anything</p>
          </div>
        </header>

        <section className="pdf-upload">
  <h2>Chat with a PDF</h2>

  <form onSubmit={handlePdfUpload}>
    <input
      type="file"
      accept=".pdf,application/pdf"
      onChange={(event) => {
        setPdfFile(event.target.files?.[0] || null);
        setPdfStatus("");
      }}
      disabled={uploadingPdf}
    />

    <button
      type="submit"
      disabled={!pdfFile || uploadingPdf}
    >
      {uploadingPdf ? "Processing PDF..." : "Upload PDF"}
    </button>
  </form>

  {pdfFile && (
    <p>Selected: {pdfFile.name}</p>
  )}

  {pdfStatus && (
    <p role="status">{pdfStatus}</p>
  )}
</section>

        <main className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>How can I help you?</h2>
              <p>Send a message to start chatting.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${index}-${message.role}`}
              className={`message-row ${message.role}`}
            >
              <div className="message">
                {message.content}
              </div>

              {/* {message.role === "assistant" &&
                message.sources?.length > 0 && (
                  <div className="message-sources">
                    <strong>Sources</strong>

                    {message.sources.map((source) => (
                      <p key={source.id}>
                        {source.text}
                      </p>
                    ))}
                  </div>
                )} */}
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="message typing">
                AI is thinking...
              </div>
            </div>
          )}
        </main>

        <form className="chat-form" onSubmit={handleSendMessage}>
  <input
    type="text"
    value={question}
    onChange={(event) => setQuestion(event.target.value)}
    placeholder="Type your question..."
    disabled={loading}
  />

  <button type="submit" disabled={loading || !question.trim()}>
    {loading ? "Sending..." : "Send"}
  </button>
</form>
      </div>
    </div>
  );
}

export default AiAssistant