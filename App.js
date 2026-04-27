import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [configVisivel, setConfigVisivel] = useState(false);
  const [splashVisivel, setSplashVisivel] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const splashOpacity = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(0.85)).current;
  const splashProgress = useRef(new Animated.Value(0)).current;

  const tema = modoEscuro ? temas.escuro : temas.claro;
  const styles = criarEstilos(tema);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),

        Animated.spring(splashScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),

        Animated.timing(splashProgress, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),

      Animated.delay(350),

      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),

        Animated.timing(splashScale, {
          toValue: 1.08,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setSplashVisivel(false);
    });
  }, []);

  async function abrirLink(url) {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir este link.");
    }
  }

  function alternarTema(fecharMenu = false) {
    if (fecharMenu) {
      setMenuVisivel(false);
    }

    Animated.timing(fadeAnim, {
      toValue: 0.45,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setModoEscuro((valorAtual) => !valorAtual);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    });
  }

  function abrirConfiguracoes() {
    setMenuVisivel(false);
    setConfigVisivel(true);
  }

  function sairDoApp() {
    setMenuVisivel(false);

    Alert.alert("Sair do aplicativo", "Deseja realmente sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          if (Platform.OS === "android") {
            BackHandler.exitApp();
          } else {
            Alert.alert(
              "Aviso",
              "No iPhone, o sistema não permite fechar o aplicativo diretamente."
            );
          }
        },
      },
    ]);
  }

  if (splashVisivel) {
    const larguraProgresso = splashProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 220],
    });

    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar
          style={modoEscuro ? "light" : "dark"}
          backgroundColor={tema.background}
          animated
        />

        <Animated.View
          style={[
            styles.splashContent,
            {
              opacity: splashOpacity,
              transform: [{ scale: splashScale }],
            },
          ]}
        >
          <Image
            source={require("./assets/logo-mark.png")}
            style={styles.splashLogo}
            resizeMode="contain"
          />

          <Text style={styles.splashTitulo}>Meu Perfil</Text>

          <Text style={styles.splashSubtitulo}>
            Preparando seu cartão digital
          </Text>

          <View style={styles.splashBarra}>
            <Animated.View
              style={[
                styles.splashBarraPreenchida,
                {
                  width: larguraProgresso,
                },
              ]}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style={modoEscuro ? "light" : "dark"}
        backgroundColor={tema.background}
        animated
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topBar}>
            <Pressable
              style={styles.nomeAppArea}
              onPress={() => setMenuVisivel(true)}
            >
              <Text style={styles.nomeApp}>Meu Perfil</Text>
              <Text style={styles.setaMenu}>▼</Text>
            </Pressable>

            <Pressable style={styles.botaoTema} onPress={() => alternarTema()}>
              <Text style={styles.textoBotaoTema}>
                {modoEscuro ? "☀️ Claro" : "🌙 Noturno"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.header}>
            <Image
              source={require("./assets/senai-logo.png")}
              style={styles.senaiLogo}
              resizeMode="contain"
            />

            <Image
              source={require("./assets/logo-mark.png")}
              style={styles.appLogo}
              resizeMode="contain"
            />

            <Text style={styles.titulo}>Meu Perfil</Text>

            <Text style={styles.subtitulo}>
              Cartão digital para apresentação profissional
            </Text>
          </View>

          <View style={styles.cardPrincipal}>
            <Text style={styles.nome}>Gustavo Rocha de Jesus</Text>

            <Text style={styles.descricao}>
              Estudante de programação em formação, com interesse em
              desenvolvimento mobile, interfaces modernas e soluções digitais.
            </Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Objetivo do app</Text>

            <View style={styles.card}>
              <Text style={styles.textoCard}>
                Facilitar a apresentação profissional de estudantes por meio de
                um cartão digital simples, moderno e acessível.
              </Text>
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Problema que o app resolve</Text>

            <View style={styles.card}>
              <Text style={styles.textoCard}>
                Muitas vezes, um estudante precisa se apresentar de forma rápida,
                organizada e profissional. Este aplicativo centraliza nome, área
                de interesse, linguagem favorita e formas de contato em uma única
                tela.
              </Text>
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Informações</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Linguagem</Text>
                <Text style={styles.infoValor}>JavaScript</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Framework</Text>
                <Text style={styles.infoValor}>React Native</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Área</Text>
                <Text style={styles.infoValor}>Mobile</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValor}>Estudando</Text>
              </View>
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Contato</Text>

            <Pressable
              style={styles.botaoWhatsapp}
              onPress={() => abrirLink("https://wa.me/5575999999999")}
            >
              <Text style={styles.textoBotao}>
                Entrar em contato pelo WhatsApp
              </Text>
            </Pressable>

            <Pressable
              style={styles.botaoGithub}
              onPress={() => abrirLink("https://github.com/")}
            >
              <Text style={styles.textoBotao}>Ver GitHub / Portfólio</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>

      <Modal transparent visible={menuVisivel} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitulo}>Menu</Text>

            <Pressable style={styles.itemMenu} onPress={abrirConfiguracoes}>
              <Text style={styles.itemMenuTexto}>⚙️ Configurações</Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={() => alternarTema(true)}
            >
              <Text style={styles.itemMenuTexto}>
                {modoEscuro ? "☀️ Ativar modo claro" : "🌙 Ativar modo noturno"}
              </Text>
            </Pressable>

            <Pressable style={styles.itemMenu} onPress={sairDoApp}>
              <Text style={styles.itemMenuTextoSair}>🚪 Sair do app</Text>
            </Pressable>

            <Pressable
              style={styles.botaoFechar}
              onPress={() => setMenuVisivel(false)}
            >
              <Text style={styles.textoFechar}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={configVisivel} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitulo}>Configurações</Text>

            <View style={styles.configBox}>
              <Text style={styles.configLabel}>Tema atual</Text>
              <Text style={styles.configValor}>
                {modoEscuro ? "Modo noturno" : "Modo claro"}
              </Text>
            </View>

            <View style={styles.configBox}>
              <Text style={styles.configLabel}>Versão do app</Text>
              <Text style={styles.configValor}>1.0.0</Text>
            </View>

            <View style={styles.configBox}>
              <Text style={styles.configLabel}>Tecnologia</Text>
              <Text style={styles.configValor}>React Native + Expo</Text>
            </View>

            <Pressable
              style={styles.botaoConfigTema}
              onPress={() => alternarTema()}
            >
              <Text style={styles.textoBotao}>
                {modoEscuro ? "Ativar modo claro" : "Ativar modo noturno"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.botaoFechar}
              onPress={() => setConfigVisivel(false)}
            >
              <Text style={styles.textoFechar}>Fechar configurações</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const temas = {
  claro: {
    background: "#f2f5fa",
    card: "#ffffff",
    cardPrincipal: "#003f91",
    textoPrincipal: "#1f2937",
    textoSecundario: "#667085",
    textoCard: "#4b5563",
    textoInvertido: "#ffffff",
    azul: "#003f91",
    borda: "#e5e7eb",
    botaoTema: "#ffffff",
    modalOverlay: "rgba(15, 23, 42, 0.45)",
  },

  escuro: {
    background: "#0f172a",
    card: "#1e293b",
    cardPrincipal: "#172554",
    textoPrincipal: "#f8fafc",
    textoSecundario: "#cbd5e1",
    textoCard: "#d1d5db",
    textoInvertido: "#ffffff",
    azul: "#60a5fa",
    borda: "#334155",
    botaoTema: "#334155",
    modalOverlay: "rgba(0, 0, 0, 0.65)",
  },
};

function criarEstilos(tema) {
  return StyleSheet.create({
    splashContainer: {
      flex: 1,
      backgroundColor: tema.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    splashContent: {
      alignItems: "center",
      justifyContent: "center",
    },

    splashLogo: {
      width: 150,
      height: 150,
      marginBottom: 18,
    },

    splashTitulo: {
      fontSize: 34,
      fontWeight: "bold",
      color: tema.azul,
      marginBottom: 8,
    },

    splashSubtitulo: {
      fontSize: 15,
      color: tema.textoSecundario,
      marginBottom: 28,
    },

    splashBarra: {
      width: 220,
      height: 8,
      backgroundColor: tema.card,
      borderRadius: 999,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: tema.borda,
    },

    splashBarraPreenchida: {
      height: "100%",
      backgroundColor: tema.azul,
      borderRadius: 999,
    },

    container: {
      flex: 1,
      backgroundColor: tema.background,
    },

    scroll: {
      padding: 24,
      paddingBottom: 40,
    },

    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },

    nomeAppArea: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingRight: 12,
    },

    nomeApp: {
      fontSize: 20,
      fontWeight: "bold",
      color: tema.textoPrincipal,
      marginRight: 6,
    },

    setaMenu: {
      fontSize: 12,
      color: tema.textoSecundario,
      marginTop: 2,
    },

    botaoTema: {
      backgroundColor: tema.botaoTema,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: tema.borda,
    },

    textoBotaoTema: {
      color: tema.textoPrincipal,
      fontSize: 14,
      fontWeight: "bold",
    },

    header: {
      alignItems: "center",
      marginBottom: 20,
    },

    senaiLogo: {
      width: 180,
      height: 60,
      marginBottom: 14,
    },

    appLogo: {
      width: 120,
      height: 120,
      marginBottom: 10,
    },

    titulo: {
      fontSize: 32,
      fontWeight: "bold",
      color: tema.azul,
    },

    subtitulo: {
      fontSize: 15,
      color: tema.textoSecundario,
      textAlign: "center",
      marginTop: 6,
    },

    cardPrincipal: {
      backgroundColor: tema.cardPrincipal,
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      elevation: 4,
    },

    nome: {
      fontSize: 28,
      fontWeight: "bold",
      color: tema.textoInvertido,
      marginBottom: 10,
    },

    descricao: {
      fontSize: 16,
      color: "#e6eefc",
      lineHeight: 23,
    },

    secao: {
      marginBottom: 24,
    },

    tituloSecao: {
      fontSize: 20,
      fontWeight: "bold",
      color: tema.textoPrincipal,
      marginBottom: 12,
    },

    card: {
      backgroundColor: tema.card,
      borderRadius: 18,
      padding: 18,
      elevation: 3,
      borderWidth: 1,
      borderColor: tema.borda,
    },

    textoCard: {
      fontSize: 15,
      color: tema.textoCard,
      lineHeight: 22,
    },

    infoGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    infoBox: {
      width: "48%",
      backgroundColor: tema.card,
      borderRadius: 18,
      padding: 16,
      elevation: 3,
      borderWidth: 1,
      borderColor: tema.borda,
      marginBottom: 12,
    },

    infoLabel: {
      fontSize: 13,
      color: tema.textoSecundario,
      marginBottom: 6,
    },

    infoValor: {
      fontSize: 17,
      fontWeight: "bold",
      color: tema.azul,
    },

    botaoWhatsapp: {
      backgroundColor: "#25D366",
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      marginBottom: 12,
    },

    botaoGithub: {
      backgroundColor: "#111827",
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
    },

    textoBotao: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: tema.modalOverlay,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    menuCard: {
      width: "100%",
      backgroundColor: tema.card,
      borderRadius: 24,
      padding: 22,
      borderWidth: 1,
      borderColor: tema.borda,
      elevation: 8,
    },

    menuTitulo: {
      fontSize: 24,
      fontWeight: "bold",
      color: tema.textoPrincipal,
      marginBottom: 18,
    },

    itemMenu: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tema.borda,
    },

    itemMenuTexto: {
      fontSize: 17,
      fontWeight: "600",
      color: tema.textoPrincipal,
    },

    itemMenuTextoSair: {
      fontSize: 17,
      fontWeight: "600",
      color: "#ef4444",
    },

    botaoFechar: {
      marginTop: 18,
      backgroundColor: tema.azul,
      padding: 14,
      borderRadius: 14,
      alignItems: "center",
    },

    textoFechar: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },

    configBox: {
      backgroundColor: tema.background,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },

    configLabel: {
      fontSize: 13,
      color: tema.textoSecundario,
      marginBottom: 6,
    },

    configValor: {
      fontSize: 17,
      fontWeight: "bold",
      color: tema.textoPrincipal,
    },

    botaoConfigTema: {
      marginTop: 8,
      backgroundColor: "#111827",
      padding: 14,
      borderRadius: 14,
      alignItems: "center",
    },
  });
}