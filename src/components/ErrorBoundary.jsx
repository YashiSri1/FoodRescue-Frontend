import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // also log to console
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'Poppins, sans-serif' }}>
          <h1 style={{ color: '#c53030' }}>Something went wrong</h1>
          <p style={{ color: '#333' }}>{String(this.state.error && this.state.error.toString())}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>
            {this.state.info?.componentStack}
          </details>
          <p style={{ marginTop: 20 }}>Open DevTools console for full stack trace.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
