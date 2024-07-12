import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Dimensions, Text, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import axios from 'axios';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';

const { height, width } = Dimensions.get('window');

export default function App() {
  const [screen, setScreen] = useState('login');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [userData, setUserData] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const backendUrl = 'https://gerencia-notas-mika-8e6ac5230811.herokuapp.com/';
  
  const [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${backendUrl}/csrf-token`, { withCredentials: true });
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        Alert.alert('Erro', `Erro ao obter CSRF token: ${error.message}`);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplashScreen();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/login`, { login, senha }, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      if (response.data.success) {
        const userDataResponse = await axios.post(`${backendUrl}/get_user_data`, { login }, {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        });
        if (userDataResponse.data.status === "success") {
          setUserData(userDataResponse.data);
          setScreen('dashboard');
        } else {
          Alert.alert('Erro', `Erro ao obter dados do usuário: ${userDataResponse.data.message}`);
        }
      } else {
        Alert.alert('Erro', `Erro ao fazer login: ${response.data.message}`);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao fazer login: ${error.message}`);
    }
  };

  const handleCreateAccount = async () => {
    try {
      const response = await axios.post(`${backendUrl}/create_account`, { login, senha }, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      Alert.alert('Info', response.data.message);
      if (response.data.success) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
      } else {
        Alert.alert('Erro', `Erro ao criar conta: ${response.data.message}`);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao criar conta: ${error.message}`);
    }
  };  

  const handleUpdateInfo = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.post(`${backendUrl}/update_info`, { login, senha }, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      if (response.data.success) {
        const userDataResponse = await axios.post(`${backendUrl}/get_user_data`, { login }, {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        });
        if (userDataResponse.data.status === "success") {
          setUserData(userDataResponse.data);
        } else {
          Alert.alert('Erro', `Erro ao atualizar informações: ${userDataResponse.data.message}`);
        }
      }
      Alert.alert('Info', response.data.message);
    } catch (error) {
      Alert.alert('Erro', `Erro ao atualizar informações: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/logout`, {}, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      if (response.data.success) {
        setScreen('login');
        setUserData(null);
      } else {
        Alert.alert('Erro', `Erro ao fazer logout: ${response.data.message}`);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao fazer logout: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {isUpdating ? (
        <View style={styles.loadingContainer}>
          <Image source={require('./assets/loading.gif')} style={styles.loadingImage} />
          <Text style={styles.loadingText}> /Atualizando informações/ </Text>
        </View>
      ) : screen === 'login' || screen === 'createAccount' ? (
        <LoginScreen
          login={login}
          setLogin={setLogin}
          senha={senha}
          setSenha={setSenha}
          handleLogin={handleLogin}
          handleCreateAccount={handleCreateAccount}
          setScreen={setScreen}
          screen={screen}
        />
      ) : (
        <Dashboard
          userData={userData}
          handleUpdateInfo={handleUpdateInfo}
          handleLogout={handleLogout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#162025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 25,
    color: '#CDE4DE',
    fontFamily: 'IBMPlexMono_600SemiBold',
  },
});
