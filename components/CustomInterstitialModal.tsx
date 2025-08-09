import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';

interface CustomInterstitialModalProps {
  visible: boolean;
  onClose: () => void;
  onAdClick?: () => void;
}

const { width, height } = Dimensions.get('window');

const CustomInterstitialModal: React.FC<CustomInterstitialModalProps> = ({
  visible,
  onClose,
  onAdClick,
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, countdown]);

  useEffect(() => {
    if (visible) {
      setCountdown(3);
    }
  }, [visible]);

  const handleClose = () => {
    setCountdown(3);
    onClose();
  };

  const handleAdClick = () => {
    onAdClick?.();
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 닫기 버튼 */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
            disabled={countdown > 0}
          >
            {countdown > 0 ? (
              <Text style={styles.countdownText}>{countdown}</Text>
            ) : (
              <Ionicons name="close" size={24} color="#666" />
            )}
          </TouchableOpacity>

          {/* 광고 컨텐츠 */}
          <View style={styles.adContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.title}>Substory</Text>
            <Text style={styles.subtitle}>구독 관리의 새로운 경험</Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>결제일 알림</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="analytics-outline" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>비용 분석</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>안전한 관리</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.adButton} onPress={handleAdClick}>
              <Text style={styles.adButtonText}>앱 사용하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  adContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  featuresContainer: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 16,
    color: Colors.value,
    marginLeft: 12,
    fontWeight: '500',
  },
  adButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  adButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomInterstitialModal;