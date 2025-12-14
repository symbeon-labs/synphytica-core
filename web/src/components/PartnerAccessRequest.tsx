"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PartnerAccessFormData {
    organization: string;
    contactName: string;
    email: string;
    role: string;
    researchArea: string;
    intendedUse: string;
    credentials: string;
    ndaAccepted: boolean;
}

interface PartnerAccessProps {
    onSubmit?: (data: PartnerAccessFormData) => Promise<void>;
}

export const PartnerAccessRequest = ({ onSubmit }: PartnerAccessProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState<PartnerAccessFormData>({
        organization: '',
        contactName: '',
        email: '',
        role: '',
        researchArea: '',
        intendedUse: '',
        credentials: '',
        ndaAccepted: false
    });

    const handleInputChange = (field: keyof PartnerAccessFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (onSubmit) {
                await onSubmit(formData);
            } else {
                // Default: enviar para API
                const response = await fetch('/api/partner-access/request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Failed to submit request');
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Erro ao enviar solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.organization && formData.contactName && formData.email;
            case 2:
                return formData.role && formData.researchArea;
            case 3:
                return formData.intendedUse && formData.credentials && formData.ndaAccepted;
            default:
                return false;
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
                Solicite Acesso
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !loading && setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            Acesso a Dados de Pesquisa
                                        </h2>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Solicitação para Parceiros Qualificados
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        disabled={loading}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6 flex gap-2">
                                    {[1, 2, 3].map((s) => (
                                        <div
                                            key={s}
                                            className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-cyan-500' : 'bg-gray-700'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {submitted ? (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h3>
                                        <p className="text-gray-400 mb-6">
                                            Sua solicitação está sendo analisada. Você receberá um email com as credenciais de acesso em até 48 horas.
                                        </p>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                                        >
                                            Fechar
                                        </button>
                                    </motion.div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={step}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -20, opacity: 0 }}
                                            className="space-y-4"
                                        >
                                            {step === 1 && (
                                                <>
                                                    <h3 className="text-lg font-bold text-white mb-4">Informações da Organização</h3>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Organização *</label>
                                                        <input
                                                            type="text"
                                                            value={formData.organization}
                                                            onChange={(e) => handleInputChange('organization', e.target.value)}
                                                            placeholder="Universidade, Instituto de Pesquisa, Empresa..."
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Nome do Contato *</label>
                                                        <input
                                                            type="text"
                                                            value={formData.contactName}
                                                            onChange={(e) => handleInputChange('contactName', e.target.value)}
                                                            placeholder="Dr. João Silva"
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Email Institucional *</label>
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                            placeholder="pesquisador@universidade.edu"
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {step === 2 && (
                                                <>
                                                    <h3 className="text-lg font-bold text-white mb-4">Qualificação Profissional</h3>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Cargo/Função *</label>
                                                        <select
                                                            value={formData.role}
                                                            onChange={(e) => handleInputChange('role', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                                        >
                                                            <option value="">Selecione...</option>
                                                            <option value="researcher">Pesquisador/Cientista</option>
                                                            <option value="professor">Professor/Docente</option>
                                                            <option value="phd_student">Doutorando</option>
                                                            <option value="industry_rd">P&D Industrial</option>
                                                            <option value="clinician">Médico/Clínico</option>
                                                            <option value="pharmacist">Farmacêutico</option>
                                                            <option value="other">Outro</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Área de Pesquisa *</label>
                                                        <input
                                                            type="text"
                                                            value={formData.researchArea}
                                                            onChange={(e) => handleInputChange('researchArea', e.target.value)}
                                                            placeholder="Ex: Farmacologia, Bioinformática, Medicina Canábica..."
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {step === 3 && (
                                                <>
                                                    <h3 className="text-lg font-bold text-white mb-4">Propósito e Acordo</h3>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Uso Pretendido dos Dados *</label>
                                                        <textarea
                                                            value={formData.intendedUse}
                                                            onChange={(e) => handleInputChange('intendedUse', e.target.value)}
                                                            placeholder="Descreva como pretende utilizar os dados (ex: validação de modelo, pesquisa clínica, desenvolvimento de produto...)"
                                                            rows={4}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Credenciais/Publicações *</label>
                                                        <textarea
                                                            value={formData.credentials}
                                                            onChange={(e) => handleInputChange('credentials', e.target.value)}
                                                            placeholder="Links para Lattes, ORCID, publicações relevantes, ou outras credenciais..."
                                                            rows={3}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                                                        />
                                                    </div>

                                                    <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                                        <label className="flex items-start gap-3 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.ndaAccepted}
                                                                onChange={(e) => handleInputChange('ndaAccepted', e.target.checked)}
                                                                className="mt-1 w-5 h-5 text-cyan-500 bg-slate-800 border-gray-600 rounded focus:ring-cyan-500"
                                                            />
                                                            <span className="text-sm text-gray-300">
                                                                Aceito os termos do <strong className="text-yellow-400">Acordo de Confidencialidade (NDA)</strong> e me comprometo a usar os dados exclusivamente para fins de pesquisa científica, sem divulgação pública sem autorização prévia.
                                                            </span>
                                                        </label>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Footer */}
                            {!submitted && (
                                <div className="p-6 border-t border-cyan-500/20 bg-slate-900/50 flex justify-between">
                                    <button
                                        onClick={() => setStep(s => Math.max(1, s - 1))}
                                        disabled={step === 1 || loading}
                                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Voltar
                                    </button>

                                    {step < 3 ? (
                                        <button
                                            onClick={() => setStep(s => s + 1)}
                                            disabled={!isStepValid()}
                                            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Próximo
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!isStepValid() || loading}
                                            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Enviar Solicitação'
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
