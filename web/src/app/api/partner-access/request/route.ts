import { NextRequest, NextResponse } from 'next/server';

interface PartnerAccessRequest {
    organization: string;
    contactName: string;
    email: string;
    role: string;
    researchArea: string;
    intendedUse: string;
    credentials: string;
    ndaAccepted: boolean;
    timestamp?: string;
    status?: 'pending' | 'approved' | 'rejected';
    accessToken?: string;
}

// Simulação de banco de dados (em produção, usar DB real)
const pendingRequests: Map<string, PartnerAccessRequest> = new Map();

export async function POST(request: NextRequest) {
    try {
        const data: PartnerAccessRequest = await request.json();

        // Validação básica
        if (!data.organization || !data.contactName || !data.email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!data.ndaAccepted) {
            return NextResponse.json(
                { error: 'NDA must be accepted' },
                { status: 400 }
            );
        }

        // Adicionar metadata
        const requestData: PartnerAccessRequest = {
            ...data,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Salvar solicitação
        const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        pendingRequests.set(requestId, requestData);

        // Em produção, enviar email de notificação para admin
        await sendNotificationEmail(requestData, requestId);

        // Enviar email de confirmação para solicitante
        await sendConfirmationEmail(data.email, requestId);

        return NextResponse.json({
            success: true,
            requestId,
            message: 'Request submitted successfully. You will receive an email within 48 hours.'
        });

    } catch (error) {
        console.error('Error processing partner access request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const token = searchParams.get('token');

    if (requestId) {
        const requestData = pendingRequests.get(requestId);
        if (!requestData) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        // Retornar apenas status público
        return NextResponse.json({
            requestId,
            status: requestData.status,
            timestamp: requestData.timestamp
        });
    }

    // Se tiver token de acesso, retornar dados protegidos
    if (token) {
        const isValid = await validateAccessToken(token);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Retornar dados de pesquisa
        return NextResponse.json({
            success: true,
            data: await getProtectedResearchData()
        });
    }

    return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
    );
}

// Funções auxiliares

async function sendNotificationEmail(data: PartnerAccessRequest, requestId: string) {
    // Em produção, integrar com serviço de email (SendGrid, AWS SES, etc)
    console.log('📧 New partner access request:', {
        requestId,
        organization: data.organization,
        email: data.email,
        role: data.role
    });

    // TODO: Implementar envio real de email
    // await emailService.send({
    //     to: 'admin@synphytica.com',
    //     subject: `New Partner Access Request: ${data.organization}`,
    //     body: `...`
    // });
}

async function sendConfirmationEmail(email: string, requestId: string) {
    console.log('📧 Sending confirmation to:', email, 'Request ID:', requestId);

    // TODO: Implementar envio real de email
}

async function validateAccessToken(token: string): Promise<boolean> {
    // Em produção, validar token JWT ou consultar DB
    // Por enquanto, aceitar tokens que começam com "SYNP-"
    return token.startsWith('SYNP-');
}

async function getProtectedResearchData() {
    // Dados protegidos disponíveis para parceiros aprovados
    return {
        specifications: {
            modelArchitecture: {
                type: "Transformer-based Neural Surrogate",
                inputDimensions: {
                    compounds: "Variable (1-20)",
                    userProfile: "128-dimensional vector"
                },
                outputHeads: {
                    efficacy: "18 therapeutic indications",
                    risk: "12 adverse effects"
                },
                uncertainty: "Monte Carlo Dropout (20 samples)"
            },
            trainingData: {
                syntheticSamples: 50000,
                realWorldValidation: "Available under separate agreement",
                compoundLibrary: "Cannabis phytochemicals (cannabinoids, terpenes, flavonoids)"
            }
        },
        intellectualProperty: {
            patents: [
                {
                    title: "Personalized Phytopharmacology Optimization System",
                    status: "Pending",
                    jurisdiction: "BR, US, EU"
                }
            ],
            trademarks: [
                "SynPhytica®",
                "GuardFlow™"
            ],
            copyrights: [
                "Neural architecture design",
                "Training methodology",
                "Optimization algorithms"
            ]
        },
        clinicalValidation: {
            status: "Phase I - Computational Validation",
            metrics: {
                predictionAccuracy: "87.3% (cross-validation)",
                uncertaintyCalibration: "0.92 (ECE score)",
                safetyRecall: "94.1% (adverse effect detection)"
            },
            nextPhase: "Prospective clinical trial (Q2 2026)",
            collaborators: "Available for qualified research institutions"
        },
        technicalDocumentation: {
            apiReference: "/docs/api",
            modelWeights: "Available after NDA signature",
            trainingScripts: "GitHub (private repository)",
            benchmarks: "/docs/benchmarks"
        },
        contactForCollaboration: {
            email: "partnerships@synphytica.com",
            researchLead: "Dr. [Name]",
            businessDevelopment: "partnerships@symbeon.tech"
        }
    };
}
