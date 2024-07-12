import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Notas from './Notas';
const { height, width } = Dimensions.get('window');

export default function Dashboard({ userData, handleLogout, handleUpdateInfo }) {
  const [selectedScreen, setSelectedScreen] = useState('home');

  const renderContent = () => {
    switch (selectedScreen) {
      case 'notas':
        return <Notas periodos={userData.trimestres} materias={userData.materias} notas={userData.notas} medias={userData.medias} componentes={userData.componentes} calculos={userData.calculos} handleUpdateInfo={handleUpdateInfo} />;
      case 'info':
        return (
          <View style={styles.homeContainer}>
            <Text style={styles.homeText}>INFO (NADA AQUI)</Text>
          </View>
        );
      default:
        return (
          <View style={styles.homeContainer}>
            <Text style={styles.homeText}>ALGO (NADA AQUI)</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Bem-Vindo(a),</Text>
            <Text style={styles.userName}>{userData.nome}</Text>
          </View>
          <View style={styles.topBarIcons}>
            <TouchableOpacity>
              <Image source={require('./assets/config.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Image source={require('./assets/sair.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => setSelectedScreen('info')}>
          <Image source={require('./assets/info.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomBarText}>/INFO+/</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => setSelectedScreen('notas')}>
          <Image source={require('./assets/notas.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomBarText}>/NOTAS/</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => setSelectedScreen('algo')}>
          <Image source={require('./assets/notas.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomBarText}>/ALGO/</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162025',
  },
  topBar: {
    backgroundColor: '#0F1920',
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    height: height * 0.15, 
    justifyContent: 'flex-end', 
  },
  topBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContainer: {
    width: '70%', 
  },
  welcomeText: {
    color: '#CDE4DE',
    fontSize: height * 0.0225,
    fontFamily: 'IBMPlexMono_400Regular',
  },
  userName: {
    color: '#A8B4C2',
    fontSize: height * 0.025,
    fontWeight: 'bold',
    fontFamily: 'IBMPlexMono_600SemiBold',
  },
  topBarIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '30%', 
  },
  icon: {
    width: width * 0.1, 
    height: width * 0.1,
    marginLeft: width * 0.05, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0F1920',
    paddingVertical: '3%',
  },
  bottomBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%', 
  },
  bottomIcon: {
    width: width * 0.12, 
    height: width * 0.12,
    marginBottom: height * 0.01,
  },
  bottomBarText: {
    color: '#CDE4DE',
    fontSize: height * 0.02,
    textAlign: 'center',
    fontFamily: 'IBMPlexMono_600SemiBold',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeText: {
    color: '#CDE4DE',
    fontSize: height * 0.025,
    fontFamily: 'IBMPlexMono_400Regular',
  },
});
