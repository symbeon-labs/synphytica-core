"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProtectedDataProps {
    accessToken: string;
}

export const ProtectedDataViewer = ({ accessToken }: ProtectedDataProps) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'specs' | 'ip' | 'clinical' | 'docs'>('specs');

    useEffect(() => {
        fetchProtectedData();
    }, [accessToken]);

    const fetchProtectedData = async () => {
        try {
            const response = await fetch(`/api/partner-access/request?token=${accessToken}`);

            if (!response.ok) {
                throw new Error('Unauthorized or invalid token');
            }

            const result = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Carregando dados protegidos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="max-w-md p-8 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">Acesso Negado</h3>
                    <p className="text-red-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <h1 className="text-3xl font-bold text-white">Dados de Pesquisa - Acesso Autorizado</h1>
                    </div>
                    <p className="text-gray-400">
                        Informações técnicas e de propriedade intelectual sob NDA
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[
                        { id: 'specs', label: 'Especificações Técnicas', icon: '⚙️' },
                        { id: 'ip', label: 'Propriedade Intelectual', icon: '📜' },
                        { id: 'clinical', label: 'Validação Clínica', icon: '🔬' },
                        { id: 'docs', label: 'Documentação', icon: '📚' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6"
                >
                    {activeTab === 'specs' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Arquitetura do Modelo</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="text-cyan-400 font-bold mb-3">Tipo de Modelo</h3>
                                    <p className="text-gray-300">{data?.specifications?.modelArchitecture?.type}</p>
                                </div>

                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="text-cyan-400 font-bold mb-3">Dimensões de Entrada</h3>
                                    <ul className="text-gray-300 space-y-1">
                                        <li>• Compostos: {data?.specifications?.modelArchitecture?.inputDimensions?.compounds}</li>
                                        <li>• Perfil de Usuário: {data?.specifications?.modelArchitecture?.inputDimensions?.userProfile}</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="text-cyan-400 font-bold mb-3">Saídas do Modelo</h3>
                                    <ul className="text-gray-300 space-y-1">
                                        <li>• Eficácia: {data?.specifications?.modelArchitecture?.outputHeads?.efficacy}</li>
                                        <li>• Risco: {data?.specifications?.modelArchitecture?.outputHeads?.risk}</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="text-cyan-400 font-bold mb-3">Quantificação de Incerteza</h3>
                                    <p className="text-gray-300">{data?.specifications?.modelArchitecture?.uncertainty}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <h3 className="text-blue-400 font-bold mb-3">Dados de Treinamento</h3>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Amostras Sintéticas: <strong>{data?.specifications?.trainingData?.syntheticSamples?.toLocaleString()}</strong></li>
                                    <li>• Validação Real: {data?.specifications?.trainingData?.realWorldValidation}</li>
                                    <li>• Biblioteca: {data?.specifications?.trainingData?.compoundLibrary}</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ip' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Propriedade Intelectual</h2>

                            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                <h3 className="text-yellow-400 font-bold mb-3">⚠️ Patentes</h3>
                                {data?.intellectualProperty?.patents?.map((patent: any, i: number) => (
                                    <div key={i} className="mb-3 last:mb-0">
                                        <p className="text-white font-medium">{patent.title}</p>
                                        <p className="text-sm text-gray-400">Status: {patent.status} | Jurisdição: {patent.jurisdiction}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="text-cyan-400 font-bold mb-3">Marcas Registradas</h3>
                                    <ul className="text-gray-300 space-y-1">
                                        {data?.intellectualProperty?.trademarks?.map((tm: string, i: number) => (
                                            <li key={i}>• {tm}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="text-cyan-400 font-bold mb-3">Direitos Autorais</h3>
                                    <ul className="text-gray-300 space-y-1">
                                        {data?.intellectualProperty?.copyrights?.map((cr: string, i: number) => (
                                            <li key={i}>• {cr}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'clinical' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Validação Clínica</h2>

                            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                                <h3 className="text-green-400 font-bold mb-3">Status Atual</h3>
                                <p className="text-gray-300 text-lg">{data?.clinicalValidation?.status}</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm mb-1">Acurácia de Predição</p>
                                    <p className="text-3xl font-bold text-cyan-400">{data?.clinicalValidation?.metrics?.predictionAccuracy}</p>
                                </div>
                                <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm mb-1">Calibração de Incerteza</p>
                                    <p className="text-3xl font-bold text-cyan-400">{data?.clinicalValidation?.metrics?.uncertaintyCalibration}</p>
                                </div>
                                <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                                    <p className="text-gray-400 text-sm mb-1">Recall de Segurança</p>
                                    <p className="text-3xl font-bold text-cyan-400">{data?.clinicalValidation?.metrics?.safetyRecall}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <h3 className="text-blue-400 font-bold mb-2">Próxima Fase</h3>
                                <p className="text-gray-300">{data?.clinicalValidation?.nextPhase}</p>
                                <p className="text-sm text-gray-400 mt-2">Colaboradores: {data?.clinicalValidation?.collaborators}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Documentação Técnica</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { label: 'API Reference', link: data?.technicalDocumentation?.apiReference },
                                    { label: 'Model Weights', link: data?.technicalDocumentation?.modelWeights },
                                    { label: 'Training Scripts', link: data?.technicalDocumentation?.trainingScripts },
                                    { label: 'Benchmarks', link: data?.technicalDocumentation?.benchmarks }
                                ].map((doc, i) => (
                                    <a
                                        key={i}
                                        href={doc.link}
                                        className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-cyan-500/50 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-medium">{doc.label}</span>
                                            <svg className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{doc.link}</p>
                                    </a>
                                ))}
                            </div>

                            <div className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg">
                                <h3 className="text-cyan-400 font-bold mb-4">Contato para Colaboração</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="font-mono">{data?.contactForCollaboration?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Líder de Pesquisa</p>
                                        <p>{data?.contactForCollaboration?.researchLead}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Desenvolvimento de Negócios</p>
                                        <p className="font-mono">{data?.contactForCollaboration?.businessDevelopment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Footer Warning */}
                <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">
                        <strong>⚠️ CONFIDENCIAL:</strong> Estas informações estão protegidas por NDA. Divulgação não autorizada pode resultar em ações legais.
                    </p>
                </div>
            </div>
        </div>
    );
};
