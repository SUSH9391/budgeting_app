import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

export const VibeChart: React.FC = () => {
  const chartWidth = Dimensions.get('window').width - 80;
  const chartHeight = 160;

  const points = [
    { day: 'Mon', x: 20, y: 120, value: 40 },
    { day: 'Tue', x: chartWidth * 0.18, y: 140, value: 20 },
    { day: 'Wed', x: chartWidth * 0.35, y: 90, value: 90 },
    { day: 'Thu', x: chartWidth * 0.52, y: 120, value: 45 },
    { day: 'Fri', x: chartWidth * 0.68, y: 65, value: 120 },
    { day: 'Sat', x: chartWidth * 0.84, y: 20, value: 210 },
    { day: 'Sun', x: chartWidth * 0.95, y: 80, value: 75 },
  ];

  // Build SVG path for smooth line
  const d = `
    M ${points[0].x} ${points[0].y}
    C ${points[0].x + 15} ${points[0].y + 10}, ${points[1].x - 15} ${points[1].y - 5}, ${points[1].x} ${points[1].y}
    C ${points[1].x + 20} ${points[1].y - 20}, ${points[2].x - 20} ${points[2].y + 10}, ${points[2].x} ${points[2].y}
    C ${points[2].x + 15} ${points[2].y + 15}, ${points[3].x - 15} ${points[3].y - 10}, ${points[3].x} ${points[3].y}
    C ${points[3].x + 20} ${points[3].y - 30}, ${points[4].x - 20} ${points[4].y + 20}, ${points[4].x} ${points[4].y}
    C ${points[4].x + 20} ${points[4].y - 30}, ${points[5].x - 20} ${points[5].y + 10}, ${points[5].x} ${points[5].y}
    C ${points[5].x + 15} ${points[5].y + 20}, ${points[6].x - 15} ${points[6].y - 10}, ${points[6].x} ${points[6].y}
  `;

  const fillD = `
    ${d}
    L ${points[6].x} ${chartHeight}
    L ${points[0].x} ${chartHeight}
    Z
  `;

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {/* Y Axis Grid lines */}
        {[0, 50, 100, 150, 200].map((val, i) => {
          const yPos = chartHeight - (val / 200) * chartHeight;
          return (
            <View key={i} style={[styles.gridRow, { top: yPos }]}>
              <Text style={styles.yLabel}>{val}</Text>
              <View style={styles.gridLine} />
            </View>
          );
        })}

        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFC700" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#FFC700" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Area Fill */}
          <Path d={fillD} fill="url(#grad)" />

          {/* Curve Line */}
          <Path d={d} fill="none" stroke="#000000" strokeWidth={3.5} />

          {/* Points */}
          {points.map((p, idx) => (
            <React.Fragment key={idx}>
              <Circle
                cx={p.x}
                cy={p.y}
                r={6}
                fill="#FFC700"
                stroke="#000000"
                strokeWidth={2.5}
              />
            </React.Fragment>
          ))}
        </Svg>
      </View>

      {/* X Axis Labels */}
      <View style={styles.xAxis}>
        {points.map((p, idx) => (
          <Text key={idx} style={styles.xLabel}>
            {p.day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartArea: {
    height: 160,
    position: 'relative',
  },
  gridRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  yLabel: {
    width: 28,
    fontSize: 10,
    fontWeight: '800',
    color: '#888',
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  svg: {
    position: 'absolute',
    left: 28,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 10,
    marginTop: 8,
  },
  xLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
});
