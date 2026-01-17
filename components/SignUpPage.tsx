import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, Hammer, 
  User, Briefcase, HardHat, CheckCircle2
} from 'lucide-react';
import { signUp, UserRole } from '../services/authService';

interface SignUpPageProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onNavigateToLogin, onNavigateToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    companyName: '',
    role: 'CREW' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password || !formData.name || !formData.companyName) {
      return '모든 필수 항목을 입력해주세요.';
    }
    if (formData.password.length < 6) {
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (formData.password !== formData.confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    if (!formData.email.includes('@')) {
      return '올바른 이메일 형식을 입력해주세요.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const { user, error: signUpError } = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        companyName: formData.companyName,
        role: formData.role,
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('이미 등록된 이메일입니다.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (user) {
        setSuccess(true);
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          onSignUpSuccess();
        }, 3000);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 성공 화면
  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg shadow-green-100"
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입 완료!</h2>
          <p className="text-gray-500 mb-6">
            이메일 인증 링크를 발송했습니다.<br />
            이메일을 확인하고 인증을 완료해주세요.
          </p>
          <p className="text-sm text-gray-400">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 py-12">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-brand text-white rounded-2xl mb-4 shadow-lg shadow-blue-200"
          >
            <Hammer size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-500 mb-4">새 계정을 만들어 시작하세요</p>
          {onNavigateToLanding && (
            <button
              onClick={onNavigateToLanding}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← 홈으로 돌아가기
            </button>
          )}
        </div>

        {/* 회원가입 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl"
              >
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이름 *</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 회사명 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">회사명 *</label>
              <div className="relative">
                <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="(주)인테리어 컴퍼니"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 역할 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">역할 선택 *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('CREW')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.role === 'CREW'
                      ? 'bg-blue-50 border-brand text-brand'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <HardHat size={24} />
                  <span className="font-bold">시공팀</span>
                  <span className="text-xs opacity-70">현장 작업자</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('OFFICE')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.role === 'OFFICE'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Briefcase size={24} />
                  <span className="font-bold">사무실 관리자</span>
                  <span className="text-xs opacity-70">현장 관리/감독</span>
                </button>
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이메일 *</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호 *</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="최소 6자 이상"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-12 text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호 확인 *</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 재입력"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-12 text-gray-900 placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={20} />
                  회원가입
                </>
              )}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-brand hover:text-blue-700 font-medium transition-colors"
              >
                로그인
              </button>
            </p>
          </div>
        </motion.div>

        {/* 푸터 */}
        <p className="text-center text-gray-400 text-sm mt-8">
          © 2024 SiteFlow. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};
