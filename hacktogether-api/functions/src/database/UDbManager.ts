import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, doc, getDoc, where, query, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from '../types/types';
import { authenticator, dbConnection } from './firebaseConfig';
import { Tags } from '../types/types';
// import { ref, uploadBytesResumable } from 'firebase/storage';
// import { uuid } from 'uuidv4';



const isUserUnique = async (username: string): Promise<boolean> => {
    const usersRef = collection(dbConnection, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size === 0;
}

export const addUser = async (userName: string, uid: string) => {
    await setDoc(doc(dbConnection, "users", uid), {
        username: userName,
        about: "",
        messages: [],
        links: [],
        projects: [],
        skills: [],
        img: "",
    });
}

export const register = async (username: string, email: string, password: string): Promise<string> => {
    if (! await isUserUnique(username)) {
        return "username already in use";
    }
    const userCredential = await createUserWithEmailAndPassword(authenticator, email, password);
    await addUser(username, userCredential.user.uid);
    return "success";
}


export const getUserById = async (uid: string): Promise<User> => {
    const docRef = doc(dbConnection, "users", uid);
    const docSnap = (await getDoc(docRef)).data();
    return docSnap as User;
}

export const login = async (email: string, password: string): Promise<User | undefined> => {
    const userCredentials = await signInWithEmailAndPassword(authenticator, email, password);
    const user = await getUserById(userCredentials.user.uid);
    return { username: user.username, uid: userCredentials.user.uid } as User;
}

export const getUserByUserName = async (userName: string): Promise<User | undefined> => {
    const usersRef = collection(dbConnection, "users");
    const usernameWithCapital: string = userName.charAt(0).toUpperCase() + userName.slice(1)
    const q = query(usersRef, where("username", "in", [userName, usernameWithCapital]));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data() as User;
}

export const getAllUsers = async (): Promise<User[] | undefined> => {
    const usersRef = collection(dbConnection, "users");
    const querySnapshot = await getDocs(query(usersRef));
    const users = querySnapshot.docs.map(user => user.data());
    return users as User[];
}

export const getAllTags = async (): Promise<Tags[] | undefined> => {
    const tagsRef = collection(dbConnection, "skills");
    const querySnapshot = await getDocs(query(tagsRef));
    const tags = querySnapshot.docs.map(tag => tag.data());
    return tags as Tags[];
}

export const updateUser = async (user: User): Promise<string> => {
    const docRef = doc(dbConnection, "users", user.uid);
    setDoc(docRef, user, { merge: true });
    return "success";
}

export const addProjectToUser = async (id: string, projectId: string) => {
    const usersRef = doc(dbConnection, "users", id);
    await updateDoc(usersRef, {
        projects: arrayUnion(projectId)
    });
}

export const addProjectToUserByUserName = async (userName: string, projectId: string) => {
    const usersRef = collection(dbConnection, "users");
    const q = query(usersRef, where("username", "==", userName));
    const querySnapshot = await getDocs(q);
    const useref = querySnapshot.docs[0].ref;
    await updateDoc(useref, {
        projects: arrayUnion(projectId)
    });
}

// export const uploadImageAndSetUserImage = async (userId: string, file: File) => {
//     const metadata = {
//         contentType: 'image/jpeg'
//     };
//     const storageRef = ref(dbStorage, 'images/' + file.name);
//     const uploadTask = uploadBytesResumable(storageRef, file, metadata);

//     // const storageRef = ref(dbStorage, 'image.png');
//     // uploadBytesResumable(storageRef, file);
// }