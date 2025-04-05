import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { MainTheme } from './theme/MainTheme.jsx';
import App from './App.jsx'
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'
import './assets/css/normalize.css'
// import './assets/css/styles.css'
import './assets/css/responsive.css'
import TimeAgo from 'javascript-time-ago'
import es from 'javascript-time-ago/locale/es'
import store from './store/index.jsx'

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={MainTheme}>
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
    </ThemeProvider>
)
