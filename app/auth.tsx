import { useAuth } from '@/utils/auth-context'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper'

export default function AuthScreen() {

    const theme = useTheme()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>('')
    const {signIn, signUp,isLoadingAuth } = useAuth()
    const router = useRouter()

    const handleAuth = async () => {
        if (!email || !password) {
            setError("Please Enter all field");
            return;
        }
        if (password.length < 1) {
            setError("Please Password more than 1 word");
            return;
        }

        setError(null);

        if (isSignUp) {
            const error = await signUp(email, password);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const error = await signIn(email, password);
            if (error) {
                setError(error);
                return;
            }
            router.replace('/')
        }
        

    }

    const handleSwitch = () => {
        setIsSignUp((prev) => !prev)
    }

    if (isLoadingAuth) {
        return (
            <View style={style.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
    
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.container}>
        <View style={style.content}>
            <Text style={style.title} variant='headlineMedium'>{isSignUp ? 'Create New User' : 'Welcome Back'}</Text>
            <TextInput
                label='Email'
                autoCapitalize='none'
                keyboardType='email-address'
                placeholder='example@gmail.com'
                mode='outlined'
                onChangeText={setEmail}
                style={style.input}
            />
            <TextInput
                label='Password'
                autoCapitalize='none'
                keyboardType='visible-password'
                mode='outlined'
                onChangeText={setPassword}
                style={style.input}

            />
            {error && <Text style={{color:theme.colors.error}}>{error}</Text>}
            <Button icon="camera" mode="contained" onPress={handleAuth} style={style.button}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
            <Button icon="camera" mode="text" onPress={handleSwitch} style={style.button}>{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up" }</Button>
        </View>
    </KeyboardAvoidingView>
  )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'f5f5f5'
    },
    content:{
        flex:1,
        justifyContent: 'center',
        padding: 15
    },
    title:{
        textAlign:'center',
        marginBottom:10
    },
    input:{
        marginBottom:10
    },
    button:{
        marginTop:10
    },
    loadingContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#f5f5f5'
    }
})