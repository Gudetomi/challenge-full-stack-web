import { ThemeDefinition } from 'vuetify'
export const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f5f5f5',   
    surface: '#ffffff',      
    primary: '#3366cc',      
    secondary: '#7c3aed',   
    accent: '#10b981',       
    error: '#ef4444',        
    warning: '#f59e0b',     
    info: '#06b6d4',        
    success: '#10b981',      
  },
}
export const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212',   
    surface: '#1e1e1e',       
    primary: '#4d8fff',      
    secondary: '#a78bfa',     
    accent: '#34d399',       
    error: '#f87171',         
    warning: '#fbbf24',      
    info: '#22d3ee',          
    success: '#34d399',       
  },
}