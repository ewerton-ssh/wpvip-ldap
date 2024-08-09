import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from './context/Socket/SocketContext';

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '8px',
                    height: '8px',
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    backgroundColor: "#2DDD7F",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#F3F3F3" : "#020913",
                },
            },
            palette: {
                type: mode,
                primary: { main: mode === "light" ? "#2DDD7F" : "#FFFFFF" },
                textPrimary: mode === "light" ? "#2DDD7F" : "#FFFFFF",
                borderPrimary: mode === "light" ? "#2DDD7F" : "#FFFFFF",
                dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
                light: { main: mode === "light" ? "#F3F3F3" : "#020913" },
                tabHeaderBackground: mode === "light" ? "#EEE" : "#051429",
                optionsBackground: mode === "light" ? "#fafafa" : "#020913",
				options: mode === "light" ? "#fafafa" : "#051429",
				fontecor: mode === "light" ? "#128c7e" : "#fff",
                fancyBackground: mode === "light" ? "#fafafa" : "#020913",
				bordabox: mode === "light" ? "#eee" : "#020913",
				newmessagebox: mode === "light" ? "#eee" : "#020913",
				inputdigita: mode === "light" ? "#fff" : "#051429",
				contactdrawer: mode === "light" ? "#fff" : "#051429",
				announcements: mode === "light" ? "#ededed" : "#020913",
				login: mode === "light" ? "#fff" : "#000000e0",
				announcementspopover: mode === "light" ? "#fff" : "#051429",
				chatlist: mode === "light" ? "#eee" : "#051429",
				boxlist: mode === "light" ? "#ededed" : "#051429",
				boxchatlist: mode === "light" ? "#ededed" : "#020913",
                total: mode === "light" ? "#fff" : "#222",
                messageIcons: mode === "light" ? "grey" : "#F3F3F3",
                inputBackground: mode === "light" ? "#FFFFFF" : "#020913",
                barraSuperior: mode === "light" ? "linear-gradient(to right, #2DDD7F, #2DDD7F , #2DDD7F)" : "#051429",
				boxticket: mode === "light" ? "#EEE" : "#051429",
				campaigntab: mode === "light" ? "#ededed" : "#051429",
				mediainput: mode === "light" ? "#ededed" : "#1c1c1c",
                background: {
                    paper: mode === "light" ? "#F3F3F3" : "#051429"
                }
            },
            mode,
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                  <SocketContext.Provider value={SocketManager}>
                      <Routes />
                  </SocketContext.Provider>
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
