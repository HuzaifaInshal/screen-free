import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatHourLabel, formatTimeWindow, calculateWindowDuration } from '../../utils/timeUtils';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';
import { TimeWindow } from '../../types/mode';

interface TimeRangePickerProps {
  windows: TimeWindow[];
  onWindowsChange: (windows: TimeWindow[]) => void;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  windows,
  onWindowsChange,
}) => {
  // Active selected window index to edit with steppers
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const activeWindow = windows[selectedIndex] || windows[0] || {
    id: 'win-1',
    startHour: 18,
    startMinute: 0,
    endHour: 6,
    endMinute: 0,
  };

  const handleAddWindow = () => {
    const newWin: TimeWindow = {
      id: `win-${Date.now()}`,
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
    };
    const next = [...windows, newWin];
    onWindowsChange(next);
    setSelectedIndex(next.length - 1);
  };

  const handleDeleteWindow = (index: number) => {
    if (windows.length <= 1) return; // Keep at least one window
    const next = windows.filter((_, i) => i !== index);
    onWindowsChange(next);
    setSelectedIndex(Math.max(0, index - 1));
  };

  const updateActiveWindow = (start: number, end: number) => {
    const updated = windows.map((w, i) => {
      if (i === selectedIndex) {
        return { ...w, startHour: start, endHour: end };
      }
      return w;
    });
    onWindowsChange(updated);
  };

  const incrementStart = (delta: number) => {
    let next = (activeWindow.startHour + delta) % 24;
    if (next < 0) next += 24;
    updateActiveWindow(next, activeWindow.endHour);
  };

  const incrementEnd = (delta: number) => {
    let next = (activeWindow.endHour + delta) % 24;
    if (next < 0) next += 24;
    updateActiveWindow(activeWindow.startHour, next);
  };

  const applyPreset = (start: number, end: number) => {
    updateActiveWindow(start, end);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Restriction Time Windows ({windows.length})</Text>
        <TouchableOpacity onPress={handleAddWindow} style={styles.addBtnHeader}>
          <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.addBtnText}>+ Add Window</Text>
        </TouchableOpacity>
      </View>

      {/* List of Configured Time Windows */}
      {windows.map((win, idx) => {
        const isSelected = idx === selectedIndex;
        const dur = calculateWindowDuration(win.startHour, win.endHour);
        return (
          <TouchableOpacity
            key={win.id || idx}
            onPress={() => setSelectedIndex(idx)}
            activeOpacity={0.7}
            style={[
              styles.windowChipCard,
              isSelected && styles.windowChipCardActive,
            ]}
          >
            <View style={styles.windowInfo}>
              <Text style={styles.windowChipTitle}>
                Window #{idx + 1}: {formatTimeWindow(win.startHour, win.endHour)}
              </Text>
              <Text style={styles.windowDurationSub}>{dur} hrs locked</Text>
            </View>

            {windows.length > 1 && (
              <TouchableOpacity
                onPress={() => handleDeleteWindow(idx)}
                style={styles.deleteWinBtn}
              >
                <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Currently Editing Window Steppers */}
      <View style={styles.editorBox}>
        <Text style={styles.editingLabel}>Editing Window #{selectedIndex + 1}</Text>
        
        {/* Presets for current window */}
        <View style={styles.presetRow}>
          <TouchableOpacity style={styles.presetPill} onPress={() => applyPreset(18, 6)}>
            <Text style={styles.presetText}>6 PM – 6 AM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetPill} onPress={() => applyPreset(22, 6)}>
            <Text style={styles.presetText}>10 PM – 6 AM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetPill} onPress={() => applyPreset(9, 17)}>
            <Text style={styles.presetText}>9 AM – 5 PM</Text>
          </TouchableOpacity>
        </View>

        {/* Stepper Controls */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperBox}>
            <Text style={styles.stepperLabel}>Start Lock</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity onPress={() => incrementStart(-1)} style={styles.stepperBtn}>
                <Ionicons name="remove" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.hourValue}>{formatHourLabel(activeWindow.startHour)}</Text>
              <TouchableOpacity onPress={() => incrementStart(1)} style={styles.stepperBtn}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Ionicons name="arrow-forward" size={18} color={COLORS.textMuted} style={styles.arrow} />

          <View style={styles.stepperBox}>
            <Text style={styles.stepperLabel}>End Lock</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity onPress={() => incrementEnd(-1)} style={styles.stepperBtn}>
                <Ionicons name="remove" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.hourValue}>{formatHourLabel(activeWindow.endHour)}</Text>
              <TouchableOpacity onPress={() => incrementEnd(1)} style={styles.stepperBtn}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  windowChipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: SPACING.sm,
    marginVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  windowChipCardActive: {
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
  },
  windowInfo: {
    flex: 1,
  },
  windowChipTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
  },
  windowDurationSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  deleteWinBtn: {
    padding: 6,
  },
  editorBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  editingLabel: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    marginBottom: SPACING.xs,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  presetPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  presetText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: RADIUS.xs,
    padding: SPACING.xs,
    alignItems: 'center',
  },
  stepperLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginBottom: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourValue: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    marginHorizontal: SPACING.xs,
  },
  arrow: {
    marginHorizontal: SPACING.xs,
  },
});
