import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, Download, TrendingUp, Users } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw1XWnxDcsC5QkggN8er1uYL79fgwxUTejKwM2zzP3ByrilH0u4iF2YvktMDoB0E88e/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // no-cors 모드에서는 response status를 확인할 수 없으므로, 
      // 요청이 완료되면 성공으로 처리합니다.
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '' }); // 폼 초기화
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <div className="relative bg-[#1A1A2E] text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 py-20 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            하루 10분 글쓰기!<br />
            <span className="text-[#2DB400]">돈이 되는 네이버 블로그</span> 만들기
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-300 mb-8">
            광고비 0원! 블로그만으로 월 100만원 수익 가능!
          </p>
          <div className="flex justify-center">
            <button className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-2 transform hover:scale-105 transition-transform">
              <Download className="w-6 h-6" />
              무료 전자책 받기
            </button>
          </div>
          <div className="flex justify-center mt-12">
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </div>
        </div>
      </div>

      {/* 주요 혜택 섹션 */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          📚 이 전자책에서 배우는 <span className="text-[#2DB400]">핵심 5가지</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-[#2DB400] mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 성과 & 후기 섹션 */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            실제 블로거들의 <span className="text-[#2DB400]">성공 후기</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-lg mb-2">{testimonial.comment}</p>
                    <p className="font-bold">{testimonial.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="bg-[#1A1A2E] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            지금 시작하세요!
          </h2>
          <p className="text-xl mb-8">
            한정 기간 무료 배포! 마감 전에 받아가세요.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
                className="px-4 py-3 rounded-lg text-black"
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일 주소"
                className="px-4 py-3 rounded-lg text-black"
                required
                disabled={isSubmitting}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="연락처 (선택사항)"
                className="px-4 py-3 rounded-lg text-black"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#FF5722] hover:bg-[#F4511E] px-6 py-3 rounded-lg font-bold whitespace-nowrap transform hover:scale-105 transition-transform ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? '처리중...' : '무료 전자책 받기'}
              </button>
            </div>
            {submitStatus === 'success' && (
              <p className="text-green-400 mt-4">
                전자책이 곧 이메일로 발송됩니다. 감사합니다!
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-400 mt-4">
                오류가 발생했습니다. 다시 시도해주세요.
              </p>
            )}
            <p className="text-sm text-gray-400 mt-4">
              * 입력하신 정보는 전자책 발송 목적으로만 사용됩니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "방문자 2배 증가 전략",
    description: "검색 노출을 높이는 키워드 선정과 SEO 최적화 방법을 알려드립니다."
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "수익형 블로그의 비밀",
    description: "체험단, 제휴 마케팅으로 월 100만원 수익을 만드는 방법을 공개합니다."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "충성 독자 확보",
    description: "꾸준한 방문자를 확보하는 콘텐츠 전략과 독자 관리 방법을 배웁니다."
  }
];

const testimonials = [
  {
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    comment: "이 책 읽고 키워드 설정 바꿨는데 조회수가 3배 올랐어요!",
    name: "김지영 블로거"
  },
  {
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    comment: "수익형 블로그를 운영하는 공식이 이렇게 쉬운 거였다니! 감사합니다.",
    name: "박현우 블로거"
  }
];

export default App;