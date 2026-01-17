
import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Hammer, ArrowRight, Wallet, Clock, ShieldCheck, CheckCircle2, 
  TrendingUp, Zap, LayoutDashboard, ChevronDown, ChevronUp, 
  FileText, Smartphone, PieChart
} from 'lucide-react';

// Scroll animation wrapper component
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = ''
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionOffset = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.7, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for multiple items
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '',
  staggerDelay = 0.1
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

interface LandingPageProps {
  onStart: () => void;
  onLogin?: () => void;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-xl md:text-2xl font-bold transition-colors ${isOpen ? 'text-brand' : 'text-gray-900 group-hover:text-brand'}`}>
          {question}
        </span>
        {isOpen ? <ChevronUp className="text-brand" /> : <ChevronDown className="text-gray-300" />}
      </button>
      {isOpen && (
        <div className="pb-8 text-gray-500 leading-relaxed text-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

interface BrowserMockupProps {
  children: React.ReactNode;
  title: string;
}

const BrowserMockup: React.FC<BrowserMockupProps> = ({ children, title }) => (
  <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden group hover:border-blue-100 transition-colors">
    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
      </div>
      <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{title}</div>
      <div className="w-10" />
    </div>
    <div className="p-8 md:p-12">
      {children}
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand text-white p-2 rounded-xl">
              <Hammer size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">SiteFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-brand transition-colors">주요 기능</a>
            <a href="#showcase" className="hover:text-brand transition-colors">서비스 상세</a>
            <a href="#faq" className="hover:text-brand transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogin || onStart}
              className="text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:text-brand hover:bg-gray-50 transition-colors"
            >
              로그인
            </button>
            <button 
              onClick={onStart}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand transition-colors soft-shadow"
            >
              시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 overflow-hidden relative">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="text-xs font-bold text-brand uppercase tracking-wider">Interior Office Solution</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-[64px] font-bold tracking-tight leading-[80px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              인테리어 현장 관리가<br />
              <span className="text-brand">더 명확해집니다.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              바쁜 현장에서 수입과 지출만 기록하세요.<br />
              복잡한 정산과 수익 분석은 SiteFlow가 실시간으로 처리합니다.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <button 
                onClick={onStart}
                className="w-full sm:w-auto bg-brand text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95"
              >
                무료로 시작하기
                <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-600 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
                서비스 시연 보기
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="absolute -inset-10 bg-blue-100/50 blur-[120px] rounded-full -z-10 animate-pulse"></div>
            <BrowserMockup title="Project Dashboard Overview">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">현장 대시보드</p>
                    <p className="text-xl font-bold text-gray-900">강남 래미안 리모델링</p>
                  </div>
                  <div className="px-3 py-1.5 bg-blue-50 rounded-full">
                    <span className="text-[10px] font-bold text-brand uppercase">진행중</span>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">총 매출</p>
                    <p className="text-lg font-bold text-gray-900">₩85,000,000</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">총 지출</p>
                    <p className="text-lg font-bold text-gray-900">₩56,500,000</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-brand uppercase tracking-wide mb-1">순수익</p>
                    <p className="text-lg font-bold text-brand">₩28,500,000</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-600">공정 진행률</span>
                    <span className="text-xs font-bold text-brand">68%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-brand to-blue-400 rounded-full"></div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">최근 거래</p>
                  {[
                    { label: '목재 자재비', amount: '- ₩3,200,000', type: 'expense', date: '오늘' },
                    { label: '2차 중도금', amount: '+ ₩25,000,000', type: 'income', date: '어제' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          <TrendingUp size={14} className={item.type === 'income' ? 'text-brand' : 'text-gray-400'} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{item.label}</p>
                          <p className="text-[10px] text-gray-400">{item.date}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${item.type === 'income' ? 'text-brand' : 'text-gray-600'}`}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </BrowserMockup>
          </motion.div>
        </div>
      </section>

      {/* Feature Icon Grid */}
      <section id="features" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              { 
                icon: <Wallet className="text-brand" />, 
                title: '현장별 독립 정산', 
                desc: '현장별로 수입과 지출을 완벽하게 분리하여 관리합니다. 자금이 섞이지 않아 명확한 자산 관리가 가능합니다.' 
              },
              { 
                icon: <Smartphone className="text-brand" />, 
                title: '모바일 최적화', 
                desc: 'PC 앞에 앉을 시간이 없는 대표님을 위해 모바일에서 모든 기능을 빠르고 편리하게 사용할 수 있습니다.' 
              },
              { 
                icon: <ShieldCheck className="text-brand" />, 
                title: '데이터 아카이빙', 
                desc: '현장이 끝나도 모든 기록은 안전하게 보관됩니다. 향후 하자 보수나 포트폴리오 관리에 활용하세요.' 
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                variants={staggerItem}
                className="bg-white p-10 rounded-3xl border border-gray-100 soft-shadow hover-shadow transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Showcase Section (Feature Highlight Style) */}
      <section id="showcase" className="py-32 space-y-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* Feature 1: Settlement */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal direction="left" className="space-y-8 order-2 lg:order-1">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-200">
                <PieChart size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                실시간 수익<br />
                <span className="text-brand">자동 정산 시스템</span>
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                더 이상 주말에 밀린 영수증과 씨름하지 마세요. <br/>
                현장에서 지출 즉시 입력만 하면, 현시점의 순수익과 마진율을 SiteFlow가 실시간으로 분석하여 대시보드에 띄워줍니다.
              </p>
              <ul className="space-y-4">
                {[
                  '카테고리별 지출 통계 자동 생성',
                  '예상 수익 대비 실제 수익률 비교',
                  '미입금 중도금 알림 및 관리'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-gray-700">
                    <CheckCircle2 className="text-brand" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2} className="order-1 lg:order-2">
              <BrowserMockup title="Finance / Real-time Settlement">
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Margin</p>
                      <p className="text-4xl font-black text-brand">34.2%</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</p>
                      <p className="text-2xl font-bold">₩28,500,000</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { l: '철거 및 폐기물 반출', a: '- ₩1,200,000', c: 'text-gray-900', b: 'bg-gray-50' },
                      { l: '3차 중도금 입금', a: '+ ₩15,000,000', c: 'text-brand', b: 'bg-blue-50/30' },
                      { l: '목재 및 석고보드 발주', a: '- ₩4,500,000', c: 'text-gray-900', b: 'bg-gray-50' },
                    ].map((item, i) => (
                      <div key={i} className={`flex justify-between items-center p-4 rounded-2xl border border-gray-50 ${item.b}`}>
                        <span className="text-sm font-bold text-gray-700">{item.l}</span>
                        <span className={`text-sm font-bold ${item.c}`}>{item.a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserMockup>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature 2: Timeline */}
        <div className="bg-surface py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <ScrollReveal direction="left" className="relative">
                <div className="absolute -inset-10 bg-brand/5 blur-[100px] rounded-full -z-10"></div>
                <BrowserMockup title="Management / Site Timeline">
                  <div className="space-y-8">
                    {[
                      { d: '오늘', t: '전기 배선 기초 작업', n: '주방 위치 변경 확인 및 배선 연장 완료', s: 'done' },
                      { d: '내일', t: '가설 칸막이 설치 및 보양', n: '엘리베이터 보양 자재 도착 예정', s: 'todo' },
                      { d: '03.24', t: '철거 마무리 및 현장 정리', n: '폐기물 차량 1대 배차 완료', s: 'todo' },
                      { d: '03.25', t: '시스템 에어컨 배관 설치', n: '실외기 위치 확정 필요', s: 'todo' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 relative">
                        {i !== 3 && <div className="absolute left-6 top-12 bottom-[-24px] w-px bg-gray-200"></div>}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 ${item.s === 'done' ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-300'}`}>
                          {item.s === 'done' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-brand uppercase tracking-widest">{item.d}</p>
                          <p className="text-lg font-bold text-gray-900">{item.t}</p>
                          <p className="text-sm text-gray-500 leading-relaxed">{item.n}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </BrowserMockup>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.2} className="space-y-8">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-gray-200">
                  <FileText size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  한눈에 보이는<br />
                  <span className="text-gray-900">현장 타임라인</span>
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  카톡방에 흩어진 보고 대신 하나의 타임라인을 구축하세요. <br/>
                  현장의 모든 히스토리가 날짜별로 정렬되어, 사고를 방지하고 완벽한 마감을 지원합니다.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-gray-900 mb-1">0%</p>
                    <p className="text-xs font-bold text-gray-400 uppercase">누락 발생률</p>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-gray-900 mb-1">24/7</p>
                    <p className="text-xs font-bold text-gray-400 uppercase">실시간 동기화</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">자주 묻는 질문</h2>
            <p className="text-lg text-gray-500">SiteFlow에 대해 궁금한 점을 확인하세요.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
          <div className="bg-white rounded-[40px] px-8 md:px-12 py-4 soft-shadow border border-gray-100">
            {[
              {
                q: '정말로 무료로 시작할 수 있나요?',
                a: '네, 현재는 베타 서비스 기간으로 모든 기능을 무료로 이용하실 수 있습니다. 가입 시 신용카드 정보를 요구하지 않습니다.'
              },
              {
                q: '기존에 사용하던 엑셀 데이터를 옮길 수 있나요?',
                a: '현재 엑셀 업로드 기능은 준비 중입니다. 당분간은 진행 중인 현장부터 하나씩 등록하여 사용해보시는 것을 권장합니다.'
              },
              {
                q: '직원들과 공유해서 사용할 수 있나요?',
                a: '곧 팀 관리 기능이 업데이트될 예정입니다. 대표님과 실장이 실시간으로 현장 상황과 정산 내역을 동기화하여 볼 수 있게 됩니다.'
              },
              {
                q: '모바일에서도 모든 기능이 작동하나요?',
                a: '네, SiteFlow는 모바일 환경에서 가장 강력합니다. 현장에서 즉시 사진을 찍고 지출을 입력하는 플로우에 최적화되어 있습니다.'
              },
              {
                q: '데이터 보안은 안전한가요?',
                a: '사용자의 모든 데이터는 암호화되어 클라우드에 안전하게 저장됩니다. 대표님 외에는 누구도 정산 내역을 열람할 수 없습니다.'
              }
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust CTA Section */}
      <section className="py-40 px-6">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto bg-gray-900 rounded-[40px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand opacity-20 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 opacity-10 blur-[80px]"></div>
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                이제 엑셀 대신,<br />
                <span className="text-brand">성장에 집중하세요.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                정산에 쏟던 에너지를 디자인과 고객 상담에 돌려드리겠습니다. <br />
                오늘 바로 첫 번째 현장을 등록해보세요.
              </p>
              
              {/* 요금제 카드 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 w-full sm:w-96 h-56 flex flex-col justify-center">
                  <p className="text-sm text-gray-400 mb-3">월간 결제</p>
                  <p className="text-5xl font-bold mb-1">₩19,000<span className="text-xl font-normal text-gray-400">/월</span></p>
                  <p className="text-sm text-gray-500">부가세 별도</p>
                </div>
                <div className="bg-brand/20 backdrop-blur-sm border border-brand/40 rounded-3xl p-10 w-full sm:w-96 h-56 flex flex-col justify-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand px-4 py-1 rounded-full text-xs font-bold">
                    12% 할인
                  </div>
                  <p className="text-sm text-blue-300 mb-3">연간 결제</p>
                  <p className="text-5xl font-bold mb-1">₩200,000<span className="text-xl font-normal text-gray-400">/년</span></p>
                  <p className="text-sm text-gray-500">월 16,667원 · 부가세 별도</p>
                  <p className="text-sm text-brand mt-2">연 28,000원 절약</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  className="w-full sm:w-auto bg-brand text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-brand/20"
                >
                  문의하기
                </button>
                <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">
                  서비스 소개서 받기
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-gray-100 px-6">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-brand text-white p-2 rounded-xl">
                  <Hammer size={20} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight">SiteFlow</span>
              </div>
              <p className="text-gray-400 max-w-xs leading-relaxed">
                인테리어 디자이너와 현장 소장을 위한 <br/>
                가장 현대적이고 전문적인 정산 솔루션
              </p>
            </div>
            <div className="space-y-4">
              <p className="font-bold">주요 기능</p>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-brand transition-colors">실시간 정산</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">공정 기록</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">팀 협업</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">데이터 리포트</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold">고객 지원</p>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-brand transition-colors">고객 센터</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">도움말</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">문의하기</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">서비스 이용약관</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-24 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-xs font-medium">
            <p>© 2024 SiteFlow Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-900">개인정보처리방침</a>
              <a href="#" className="hover:text-gray-900">이용약관</a>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
};
