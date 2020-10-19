/* eslint-disable no-fallthrough */
import React, { createContext, useState, useEffect } from 'react'
import fireApp, { db } from '../firebase/fireApp'
import * as firebase from 'firebase'

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/cloud-platform')
googleProvider.addScope('https://www.googleapis.com/auth/datastore')
const facebookProvider = new firebase.auth.FacebookAuthProvider()

export interface UserData {
    about: string;
    email: string;
    institution: string;
    name: string;
    providers: string;
    sex: string;
    uid: string;
    userAirfoils: [];
    projectsName: string[],
    activeProject: string,
    yearOfBirth: string;
}

export interface AuthContextData {
    signIn: (providerOption: string, additionalData?: { email: string; password: string }) => void;
    signOut: () => void;
    isLogged: boolean;
    user: firebase.firestore.DocumentData | null;
    userData: UserData | null;
    userRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {

    const [isLogged, setLogged] = useState(false)
    const [user, setUser] = useState<object | null>(null)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [userRef, setUserRef] = useState<firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | null>(null)

    useEffect(() => {

        fireApp.auth().onAuthStateChanged(async (usuario) => {
            if (usuario) {
                // console.log(usuario)
                const result = await db.collection('users').where('uid', '==', usuario.uid).get()
                setUserData(result.docs[0].data() as UserData)
                setUserRef(result.docs[0].ref)
                setUser(usuario)
                setLogged(true)
            }
        })

        fireApp.auth().getRedirectResult().then((result) => {
            if (result.user) {
                // console.log(result)
                setUser(result.user)
                setLogged(true)
            }
        }).catch((error) => {
            console.log(error.message)
            setUser({})
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
                            setUser({})
                            setLogged(false)
                        }
                    }).catch((error) => {
                        console.log(error.message)
                        setUser({})
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
            setUser({})
            setLogged(false)
            console.log('user sign out')
        }).catch((error) => {
            console.log('an error ocurred on user sign out process')
            console.log(error.message)
        })
    }

    return (
        <AuthContext.Provider value={{ signIn, signOut, isLogged, user, userData, userRef }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext