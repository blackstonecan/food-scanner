import { CameraType, CameraView } from 'expo-camera';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CameraModalProps {
  visible: boolean;
  facing: CameraType;
  onClose: () => void;
  onToggleFacing: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  facing,
  onClose,
  onToggleFacing,
  onBarcodeScanned,
}) => {
  const handleBarcodeScanned = ({ data }: { type: string; data: string }) => {
    onBarcodeScanned(data);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.cameraScreen}>
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>Point at barcode to scan</Text>
        </View>

        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Text style={styles.controlText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.controlButton} />

          <TouchableOpacity
            style={styles.controlButton}
            onPress={onToggleFacing}
          >
            <Text style={styles.controlText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cameraScreen: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  instructionsContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#00000080',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff00',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  controlButton: {
    backgroundColor: '#00000080',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default CameraModal;
