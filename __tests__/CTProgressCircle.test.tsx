import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { CTProgressCircle } from '../src/shared/components/CTProgressCircle';
import { PaperProvider } from 'react-native-paper';
import { darkPaperTheme } from '../src/shared/theme/paper-theme';

describe('CTProgressCircle', () => {
  it('renders correctly with default props', async () => {
    let component;
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(
        <PaperProvider theme={darkPaperTheme}>
          <CTProgressCircle progress={75} />
        </PaperProvider>,
      );
    });
    const progressCircle = component.root.findByType(CTProgressCircle);
    expect(progressCircle).toBeTruthy();
    expect(progressCircle.props.progress).toBe(75);
  });

  it('renders children correctly', async () => {
    let component;
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(
        <PaperProvider theme={darkPaperTheme}>
          <CTProgressCircle progress={50}>
            <Text testID="test-child">Inside Progress</Text>
          </CTProgressCircle>
        </PaperProvider>,
      );
    });
    const textInstance = component.root.findByProps({ testID: 'test-child' });
    expect(textInstance.props.children).toBe('Inside Progress');
  });

  it('handles size and style prop overrides', async () => {
    const customStyle = { opacity: 0.8 };
    let component;
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(
        <PaperProvider theme={darkPaperTheme}>
          <CTProgressCircle
            progress={100}
            size={120}
            strokeWidth={8}
            trackWidth={4}
            style={customStyle}
          />
        </PaperProvider>,
      );
    });
    const progressCircle = component.root.findByType(CTProgressCircle);
    expect(progressCircle).toBeTruthy();
    expect(progressCircle.props.size).toBe(120);
    expect(progressCircle.props.strokeWidth).toBe(8);
    expect(progressCircle.props.trackWidth).toBe(4);
    expect(progressCircle.props.style).toEqual(customStyle);
  });
});
