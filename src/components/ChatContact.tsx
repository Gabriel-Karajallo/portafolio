import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';

type Message = { from: 'bot' | 'user'; text: string };
type Step = 'name' | 'email' | 'message' | 'done';

const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ][a-zA-ZÀ-ÖØ-öø-ÿ\s'-]{1,49}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function botQuestion(step: Step, name: string): string {
  switch (step) {
    case 'name':
      return '¡Hola! Soy Gabriel 👋 ¿Cómo te llamas?';
    case 'email':
      return `Encantado, ${name}. ¿Cuál es tu email para poder responderte?`;
    case 'message':
      return 'Perfecto. Cuéntame, ¿en qué puedo ayudarte o qué proyecto tienes en mente?';
    default:
      return '';
  }
}

function validateStep(step: Step, value: string): string | null {
  if (step === 'name') {
    if (!NAME_REGEX.test(value)) {
      return 'Ese nombre no me parece válido — usa solo letras y espacios. ¿Lo intentamos de nuevo?';
    }
  } else if (step === 'email') {
    if (!EMAIL_REGEX.test(value)) {
      return 'Ese email no parece válido. ¿Puedes revisarlo? (por ejemplo: tu@gmail.com)';
    }
  } else if (step === 'message') {
    if (value.length < 5) {
      return 'Cuéntame un poco más sobre tu proyecto o consulta, así puedo ayudarte mejor.';
    }
  }
  return null;
}

export function ChatContact() {
  const [step, setStep] = useState<Step>('name');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: botQuestion('name', '') }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || step === 'done' || isTyping) return;

    setMessages((prev) => [...prev, { from: 'user', text: value }]);
    setInput('');

    const validationError = validateStep(step, value);

    if (validationError) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { from: 'bot', text: validationError }]);
      }, 500);
      return;
    }

    const nextData = { ...formData };
    let nextStep: Step = step;
    if (step === 'name') {
      nextData.name = value;
      nextStep = 'email';
    } else if (step === 'email') {
      nextData.email = value;
      nextStep = 'message';
    } else if (step === 'message') {
      nextData.message = value;
      nextStep = 'done';
    }
    setFormData(nextData);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botText =
        nextStep === 'done'
          ? `¡Gracias, ${nextData.name}! Ya tengo tu mensaje — te responderé a ${nextData.email} lo antes posible.`
          : botQuestion(nextStep, nextData.name);
      setMessages((prev) => [...prev, { from: 'bot', text: botText }]);
      setStep(nextStep);
    }, 700);
  };

  return (
    <div className="chat">
      <div className="chat__messages" ref={messagesRef}>
        {messages.map((message, index) => (
          <div className={`chat__row chat__row--${message.from}`} key={index}>
            {message.from === 'bot' && (
              <div className="chat__avatar">
                <ImagePlaceholder label="" shape="circle" />
              </div>
            )}
            <div className="chat__bubble">{message.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat__row chat__row--bot">
            <div className="chat__avatar">
              <ImagePlaceholder label="" shape="circle" />
            </div>
            <div className="chat__bubble chat__bubble--typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
      {step !== 'done' ? (
        <form className="chat__input-row" onSubmit={handleSend} noValidate>
          <input
            type={step === 'email' ? 'email' : 'text'}
            placeholder={
              step === 'name' ? 'Escribe tu nombre...' : step === 'email' ? 'tu@email.com' : 'Tu mensaje...'
            }
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isTyping}
            maxLength={step === 'name' ? 50 : step === 'email' ? 100 : 300}
          />
          <button type="submit" className="chat__send" aria-label="Enviar" disabled={isTyping}>
            <Send size={16} />
          </button>
        </form>
      ) : (
        <div className="chat__done">Conversación completada</div>
      )}
    </div>
  );
}
