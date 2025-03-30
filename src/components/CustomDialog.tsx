// src/components/Dialog/index.tsx
import React, {createContext, useState, useContext, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ButtonConfig = {
  text: string;
  onPress?: () => void;
  style?: object;
  textStyle?: object;
};

type DialogOptions = {
  title?: string;
  content: string | React.ReactNode;
  buttons?: ButtonConfig[];
  dismissOnTouchOutside?: boolean;
  customContent?: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
};

type DialogContextType = {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
};

const DialogContext = createContext<DialogContextType>({
  showDialog: () => {},
  hideDialog: () => {},
});

export const DialogProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    content: '',
    buttons: [],
  });

  const showDialog = useCallback((dialogOptions: DialogOptions) => {
    setOptions({
      ...dialogOptions,
      buttons: dialogOptions.buttons || [],
      dismissOnTouchOutside: dialogOptions.dismissOnTouchOutside ?? true,
    });
    setVisible(true);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
    setOptions({content: ''});
  }, []);

  const renderButtons = () => {
    if (options.customContent) return null;

    return (
      <View style={styles.buttonContainer}>
        {(options.buttons || []).map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              button.onPress?.();
              hideDialog();
            }}
            style={[styles.button, button.style]}>
            <Text style={[styles.buttonText, button.textStyle]}>
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <DialogContext.Provider value={{showDialog, hideDialog}}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType={options.animationType || 'fade'}
        onRequestClose={hideDialog}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={options.dismissOnTouchOutside ? hideDialog : undefined}>
          <View style={styles.dialog}>
            {/* 标题区域 */}
            {options.title && (
              <View style={styles.header}>
                <Text style={styles.title}>{options.title}</Text>
                <TouchableOpacity onPress={hideDialog}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            )}

            {/* 内容区域 */}
            <View style={styles.content}>
              {options.customContent ||
                (typeof options.content === 'string' ? (
                  <Text style={styles.contentText}>{options.content}</Text>
                ) : (
                  options.content
                ))}
            </View>

            {renderButtons()}
          </View>
        </TouchableOpacity>
      </Modal>
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);

// 样式配置
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  content: {
    padding: 24,
    minHeight: 80,
  },
  contentText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
});
