import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Dialog, { DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog visible={visible} onTouchOutside={onCancel}>
      <DialogContent>
        <View>
          <Text>{title}</Text>
          <Text>{message}</Text>
        </View>
      </DialogContent>
      <DialogFooter>
        <DialogButton text="Cancel" onPress={onCancel} />
        <DialogButton text="Confirm" onPress={onConfirm} />
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
