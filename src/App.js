import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Paper, TextField, Button, Typography, Alert, 
  AppBar, Toolbar, Box 
} from '@mui/material';

function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('login'); // 'login' or 'register'

  const handleSubmit = async () => {
    try {
      const endpoint = view === 'register' ? '/register' : '/login';
      const body = view === 'register' ? form : { email: form.email, password: form.password };
      
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, body);
      setUser(res.data.user);
      setMessage(` ${view === 'register' ? 'Registered!' : 'Logged in!'} Welcome ${res.data.user.name}`);
    } catch (error) {
      setMessage(` ${error.response?.data?.message || 'Error'}`);
    }
  };

  const logout = () => {
    setUser(null);
    setForm({ name: '', email: '', password: '' });
    setMessage('');
  };

  if (user) {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Customer Portal</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Welcome {user.name}!</Typography>
            <Typography>Email: {user.email}</Typography>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
                Switch to {view === 'login' ? 'Register' : 'Login'}
              </Button>
              <Button variant="outlined" color="error" onClick={logout} sx={{ ml: 2 }}>
                Logout
              </Button>
            </Box>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          {view === 'register' ? 'Register' : 'Login'}
        </Typography>
        
        {view === 'register' && (
          <TextField
            fullWidth
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mb: 2 }}
          />
        )}
        
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          sx={{ mb: 3 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mb: 2 }}
        >
          {view === 'register' ? 'Register' : 'Login'}
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setView(view === 'login' ? 'register' : 'login')}
        >
          Switch to {view === 'register' ? 'Login' : 'Register'}
        </Button>
        
        {message && (
          <Alert severity={message.includes('ok') ? 'success' : 'error'} sx={{ mt: 3 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default App;