import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'

export default function AuthScreen() {

    const [isSignUp, setIsSignUp] = useState(false)
    const handleSwitch = () => {
        setIsSignUp((prev) => !prev)
    }
    
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
            <Text>{isSignUp ? 'Create New User' : 'Welcome Back'}</Text>
            <TextInput
                label='Email'
                autoCapitalize='none'
                keyboardType='email-address'
                placeholder='example@gmail.com'
                mode='outlined'
            />
            <TextInput
                label='Password'
                autoCapitalize='none'
                keyboardType='visible-password'
                mode='outlined'
            />
            <Button icon="camera" mode="contained">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
            <Button icon="camera" mode="text" onPress={handleSwitch}>{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up" }</Button>
        </View>
    </KeyboardAvoidingView>
  )
}