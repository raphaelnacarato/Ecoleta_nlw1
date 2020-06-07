import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFResponse {
  id: number,
  sigla: string,
  nome: string
}

interface IBGECityResponse {
  id: number,
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<IBGEUFResponse[]>([])
  const [selectedUf, setSelectedUf] = useState('0')

  const [cities, setCities] = useState<IBGECityResponse[]>([])
  const [selectedCity, setSelectedCity] = useState('0')

  const navigation = useNavigation()

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => {
        setUfs(res.data)
      })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      setCities([])
    }

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
      .then(res => {
        setCities(res.data)
      })
  }, [selectedUf])


  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    })
  }

  const ufsArray = ufs.map(uf => (
    { key: uf.id, label: uf.nome, value: uf.sigla }
  ))

  const citiesArray = cities.map(city => (
    { key: city.id, label: city.nome, value: city.nome }
  ))


  const placeholderUF = {
    label: 'Selecione uma UF',
    value: 0,
    color: '#FFF',
  };

  const placeholderCity = {
    label: 'Selecione uma cidade',
    value: 0,
    color: '#FFF',
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            items={ufsArray}
            value={selectedUf}
            onValueChange={value => setSelectedUf(value)}
            placeholder={placeholderUF}
            style={{ inputIOS: styles.input, inputAndroid: styles.input }}
          // maxLength={2}
          // autoCapitalize='characters'
          // autoCorrect={false}
          />

          <RNPickerSelect
            items={citiesArray}
            value={selectedCity}
            onValueChange={value => setSelectedCity(value)}
            placeholder={placeholderCity}
            style={{ inputIOS: styles.input, inputAndroid: styles.input }}
          // autoCapitalize='words'
          // autoCorrect={false}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name='arrow-right' color='#FFF' size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home
