import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { Button } from '../components/common/Button';
import { MobileApp, AppCollection } from '../types/app';

interface OverlayLockScreenProps {
  blockedApp?: MobileApp;
  ruleName?: string;
  reason?: string;
  onEmergencyOverride?: () => void;
  onClose?: () => void;
}

export const OverlayLockScreen: React.FC<OverlayLockScreenProps> = ({
  blockedApp,
  ruleName = 'Night Sleep Window',
  reason = 'Restricted during schedule lock',
  onEmergencyOverride,
  onClose,
}) => {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.card}>
        <View style={styles.lockIconBadge}>
          <Ionicons name="lock-closed" size={32} color={COLORS.danger} />
        </View>

        <Text style={styles.title}>App Restricted</Text>
        <Text style={styles.subtitle}>
          Screen Free active restriction mode is blocking access to this application.
        </Text>

        {blockedApp && (
          <View style={styles.appCard}>
            {blockedApp.iconUri ? (
              <Image source={{ uri: blockedApp.iconUri }} style={styles.appIcon} />
            ) : (
              <View style={[styles.iconBg, { backgroundColor: blockedApp.iconColor }]}>
                <Ionicons name={blockedApp.iconName as any} size={22} color="#fff" />
              </View>
            )}
            <View style={styles.appDetails}>
              <Text style={styles.appName}>{blockedApp.name}</Text>
              <Text style={styles.appCategory}>{blockedApp.category}</Text>
            </View>
          </View>
        )}

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>ACTIVE RULE</Text>
          <Text style={styles.ruleTitle}>{ruleName}</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>

        <View style={styles.btnRow}>
          {onEmergencyOverride && (
            <Button
              title="Request Override"
              variant="outline"
              icon="flash-outline"
              onPress={onEmergencyOverride}
              style={{ flex: 1, marginRight: SPACING.xs }}
            />
          )}
          {onClose && (
            <Button
              title="Exit App"
              variant="primary"
              icon="arrow-back"
              onPress={onClose}
              style={{ flex: 1, marginLeft: SPACING.xs }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 13, 25, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    zIndex: 9999,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 85, 0.3)',
  },
  lockIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 0, 85, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.sm,
    width: '100%',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appDetails: {
    marginLeft: SPACING.sm,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
  appCategory: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  reasonBox: {
    backgroundColor: 'rgba(255, 0, 85, 0.08)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    width: '100%',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 85, 0.2)',
  },
  reasonLabel: {
    color: COLORS.danger,
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 0.5,
  },
  ruleTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    marginTop: 2,
  },
  reasonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
