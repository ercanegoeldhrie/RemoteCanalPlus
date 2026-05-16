import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, NativeModules } from 'react-native';
import { Colors } from '../theme/colors';

// Récupération sécurisée de notre module Kotlin fait maison
const { InfraredModule } = NativeModules;

export default function HomeScreen() {
  
  const handlePress = async (buttonName: string, patternString: string) => {
    try {
      if (!InfraredModule) {
        Alert.alert("Erreur Système", "Le module natif InfraredModule n'a pas été initialisé.");
        return;
      }

      // 1. Vérification matérielle directe sur la puce du Redmi
      const hasIr = await InfraredModule.hasIrEmitter();
      
      if (!hasIr) {
        Alert.alert("Matériel", "Émetteur infrarouge physique introuvable sur ce téléphone.");
        return;
      }

      console.log(`Signal physique envoyé pour : ${buttonName}`);

      // 2. Envoi direct du signal brut (Fréquence standard Canal+ : 38000 Hz)
      await InfraredModule.transmit(38000, patternString);

    } catch (error: any) {
      Alert.alert("Erreur IR", error.message || "Une erreur est survenue.");
    }
  };

  // Signaux génériques de test basés sur le protocole standard (microsecondes)
  const POWER_PATTERN = "9000,4500,560,560,560,560,560,1690,560,560,560,560,560,560,560,560";
  const VOL_UP_PATTERN = "9000,4500,560,560,560,560,560,1690,560,560,560,560,560,560,560,1690";
  const VOL_DOWN_PATTERN = "9000,4500,560,560,560,560,560,1690,560,560,560,560,560,560,560,560";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REMOTE CANAL+</Text>

      <TouchableOpacity style={[styles.button, styles.powerButton]} onPress={() => handlePress('POWER', POWER_PATTERN)}>
        <Text style={styles.buttonText}>🔑 POWER</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('VOL +', VOL_UP_PATTERN)}>
          <Text style={styles.buttonText}>VOL +</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('VOL -', VOL_DOWN_PATTERN)}>
          <Text style={styles.buttonText}>VOL -</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('CH +', VOL_UP_PATTERN)}>
          <Text style={styles.buttonText}>CH 🔼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('CH -', VOL_DOWN_PATTERN)}>
          <Text style={styles.buttonText}>CH 🔽</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  title: { color: Colors.primary, fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  row: { flexDirection: 'row', marginBottom: 20 },
  button: { backgroundColor: Colors.surface, paddingVertical: 20, paddingHorizontal: 30, borderRadius: 10, marginHorizontal: 10, minWidth: 110, alignItems: 'center' },
  powerButton: { backgroundColor: Colors.power, marginBottom: 40, width: 240 },
  buttonText: { color: Colors.text, fontSize: 18, fontWeight: 'bold' },
});