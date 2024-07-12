import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text, TouchableOpacity, Image } from 'react-native';

export default function LoginScreen({
  login,
  setLogin,
  senha,
  setSenha,
  handleLogin,
  handleCreateAccount,
  setScreen,
  screen
}) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let errors = {};

    const trimmedLogin = login.trim();
    setLogin(trimmedLogin);

    if (trimmedLogin.length !== 8 || isNaN(trimmedLogin)) {
      valid = false;
      errors.login = 'O usuário deve ser numérico e conter 8 caracteres';
    }

    if (senha.length < 4 || senha.length > 25) {
      valid = false;
      errors.senha = 'A senha deve ter entre 4 e 25 caracteres';
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (action) => {
    if (validate()) {
      setLoading(true);
      try {
        await action();
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Erro', 'Verifique os campos e tente novamente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{screen === 'login' ? 'Login' : 'Criar Conta'}</Text>
      <TextInput
        style={[styles.input, errors.login && styles.errorInput]}
        placeholder="Usuário"
        placeholderTextColor="#A8B4C2"
        value={login}
        onChangeText={(text) => setLogin(text.trim())}
        editable={!loading}
      />
      {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
      <TextInput
        style={[styles.input, errors.senha && styles.errorInput]}
        placeholder="Senha"
        placeholderTextColor="#A8B4C2"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />
      {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
      {loading ? (
        <Image source={require('./assets/loading.gif')} style={styles.loading} />
      ) : (
        <>
          {screen === 'login' && (
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit(handleLogin)}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
          {screen === 'createAccount' && (
            <>
              <TouchableOpacity style={styles.button} onPress={() => handleSubmit(handleCreateAccount)}>
                <Text style={styles.buttonText}>Criar Conta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setScreen('login')}>
                <Text style={styles.buttonText}>Voltar ao Login</Text>
              </TouchableOpacity>
            </>
          )}
          {screen === 'login' && (
            <TouchableOpacity style={styles.button} onPress={() => setScreen('createAccount')}>
              <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
          )}
        </>
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
    padding: 20,
  },
  title: {
    color: '#CDE4DE',
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'IBMPlexMono_600SemiBold',
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    borderColor: '#A8B4C2',
    backgroundColor: '#0F1920',
    color: '#CDE4DE',
    padding: 10,
    borderRadius: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1F2D36',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#CDE4DE',
    fontSize: 18,
    fontFamily: 'IBMPlexMono_600SemiBold',
  },
  loading: {
    width: 50,
    height: 50,
  },
});
