/* eslint-disable no-fallthrough */
import React, { createContext, useState, useEffect } from 'react'
import { userAPI, UserDataType } from '../api/aerodbApi'
import fireApp from '../firebase/fireApp'
import * as firebase from 'firebase'

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/cloud-platform')
googleProvider.addScope('https://www.googleapis.com/auth/datastore')
const facebookProvider = new firebase.auth.FacebookAuthProvider()

export interface ProjectRefs {
    name: string;
    projectId: number;
}

export interface AuthContextData {
    signIn: (providerOption: string, additionalData?: { email: string; password: string }) => void;
    signOut: () => void;
    isLogged: boolean;
    updateUserData: () => Promise<void>;
    user: firebase.User | undefined;
    userData: UserDataType | undefined;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {

    const [isLogged, setLogged] = useState(false)
    const [user, setUser] = useState<firebase.User | undefined>(undefined)
    const [userData, setUserData] = useState<UserDataType | undefined>(undefined)

    useEffect(() => {

        fireApp.auth().onAuthStateChanged(async (usuario) => {
            if (usuario) {
                // console.log(usuario)
                const usuarioDB = await userAPI.getOneUser(usuario.uid)
                setUserData(usuarioDB.data)
                setUser(usuario)
                setLogged(true)
                document.cookie = `authJWT=${usuario?.getIdToken()}`
            }
        })

        fireApp.auth().getRedirectResult().then(async (result) => {
            if (result.user) {
                // console.log(result)
                const usuarioDB = await userAPI.getOneUser(result.user.uid)
                const authToken = await result.user.getIdToken()
                setUserData(usuarioDB.data)
                setUser(result.user)
                setLogged(true)
                document.cookie = `authJWT=${authToken}`
            }
        }).catch((error) => {
            console.log(error.message)
            setUser(undefined)
            setLogged(false)
        })
    }, [])

    const signIn = (providerOption: string, additionalData?: { email: string; password: string }) => {

        // Baseado no valor de providerOption escolhe o provider adequado
        switch (providerOption) {
            case "google":
                fireApp.auth().signInWithRedirect(googleProvider)
                break
            case "facebook":
                fireApp.auth().signInWithRedirect(facebookProvider)
                break
            case "custom":
                if (additionalData) {
                    fireApp.auth().signInWithEmailAndPassword(additionalData.email, additionalData.password).then((result) => {
                        if (result.user) {
                            console.log(result)
                            setUser(result.user)
                            setLogged(true)
                        } else {
                            setUser(undefined)
                            setLogged(false)
                        }
                    }).catch((error) => {
                        console.log(error.message)
                        setUser(undefined)
                        setLogged(false)
                    })
                } else {
                    console.log('please specify an email and a password')
                }
                break
            default:
                console.log('selecione um provedor de autenticação')
        }

        return
    }

    const signOut = () => {
        fireApp.auth().signOut().then(() => {
            setUser(undefined)
            setLogged(false)
            console.log('user sign out')
        }).catch((error) => {
            console.log('an error ocurred on user sign out process')
            console.log(error.message)
        })
    }

    // Atualiza os dados do usuario atual quando invocado
    const updateUserData = async () => {
        if (!user) return
        const usuarioDB = await userAPI.getOneUser(user.uid)
        setUserData(usuarioDB.data)
    }

    return (
        <AuthContext.Provider value={{ signIn, signOut, updateUserData, isLogged, user, userData }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext