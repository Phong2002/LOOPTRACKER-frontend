import { createSlice } from '@reduxjs/toolkit';

const RegistrationRequestSlice = createSlice({
    name: 'registrationRequest',
    initialState: {
        step: 0,
        stepOpen:0,
        firstName:'',
        lastName:'',
        gender:'',
        province:null,
        district:null,
        ward:null,
        address:'',
        email:'',
        phoneNumber:'',
        citizenIdNumber:'',
        licenseNumber:'',
        fileCCCDInputFront:null,
        fileCCCDInputBack:null,
        fileGPLXInputFront:null,
        fileGPLXInputBack:null,
    },
    reducers: {
        updateStep(state, action) {
            state.step = action.payload;
            if(action.payload>state.stepOpen){
                state.stepOpen = action.payload;
            }
        },
        updateData(state, action) {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.gender = action.payload.gender
            state.province = action.payload.province;
            state.district = action.payload.district;
            state.ward = action.payload.ward;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.citizenIdNumber = action.payload.citizenIdNumber;
            state.licenseNumber = action.payload.licenseNumber;
            state.address = `${action.payload.ward.label} - ${action.payload.district.label} - ${action.payload.province.label}`
        },
        addFileCCCDInputFront(state, action) {
            console.log("=======================",action.payload)
            state.fileCCCDInputFront=action.payload;
        },
        addFileCCCDInputBack(state, action) {
            state.fileCCCDInputBack=action.payload;
        },
        addFileGPLXInputFront(state, action) {
            state.fileGPLXInputFront=action.payload;
        },
        addFileGPLXInputBack(state, action) {
            state.fileGPLXInputBack=action.payload;
        },

    },

});

export const { addFileCCCDInputFront, addFileCCCDInputBack,
    addFileGPLXInputFront,addFileGPLXInputBack,
    updateData,updateStep} = RegistrationRequestSlice.actions;

export default RegistrationRequestSlice.reducer;