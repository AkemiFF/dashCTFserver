"use client"
import { getAuthHeader } from '@/lib/auth';
import { BASE_URL } from '@/lib/host';
import { useState } from 'react';

export const AIChat = () => {
    const [message, setMessage] = useState('')
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResponse('');

        try {
            const response = await fetch(`${BASE_URL}/api/chat/stream/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...await getAuthHeader(),
                },
                body: JSON.stringify({ prompt: message }),
            });

            if (!response.body) throw new Error('Response body is null');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';


            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Traitement des événements SSE
                const parts = buffer.split('\n\n');
                buffer = parts.pop() || '';
                for (const part of parts) {
                    const event = part.replace(/^data: /, '');
                    if (event === '[DONE]') break;

                    try {
                        const data = JSON.parse(event);
                        if (data.error) {
                            console.error('Erreur:', data.error);
                            break;
                        }
                        if (data.content) {
                            console.log(data.content);

                            setResponse(prev => prev + data.content);
                        }
                    } catch (e) {
                        console.error('Erreur de parsing:', e);
                    }
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-chat-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Posez votre question..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
            </form>

            <div className="response-display">
                {response.split('').map((char, index) => (
                    <span
                        key={index}
                        className="char-animation"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    )
}