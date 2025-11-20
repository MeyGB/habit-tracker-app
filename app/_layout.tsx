
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

function AuthGate({children} : {children: React.ReactNode} ){
  const router = useRouter()
  // const [isAuth, setIsAuth] = useState(false)
  const isAuth = false

  useEffect(() =>{
    if(!isAuth){
      Alert.alert('dome')
      router.replace('/auth')
    }
  })

  return <>{children}</>

}

export default function RootLayout() {

  return (
  <AuthGate>
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
    </Stack>
  </AuthGate>
  );
}
