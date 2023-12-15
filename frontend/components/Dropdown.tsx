import React, { FC, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

interface Props {
  label: string;
}

const Dropdown: FC<Props> = ({ label }) => {
  const [visible, setVisible] = useState(false);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const renderDropdown = () => {
    if (visible) {
      return (
          <Text style={styles.dropdown}>
            This is where the dropdown will be rendered.
          </Text>
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={styles.buttonText}>{label}</Text>
      <Icon type='font-awesome' name='chevron-down'/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2e78b7',
      height: 50,
      width: '90%',
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      flex: 1,
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    dropdownContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    dropdown: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      width: '90%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    dropdownText: {
      fontSize: 14,
    },
    token: {
      marginTop: 20,
      fontSize: 16,
      color: '#555555',
    },
  });
  
  


export default Dropdown;