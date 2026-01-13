import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
                    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-xl border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Oups ! Une erreur est survenue.</h1>
                        <p className="mb-4 text-gray-700">Voici les détails techniques (à envoyer au développeur) :</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm mb-4">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Recharger la page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
