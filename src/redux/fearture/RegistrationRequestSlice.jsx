import { createSlice } from '@reduxjs/toolkit';

const RegistrationRequestSlice = createSlice({
    name: 'registrationRequest',
    initialState: {
        step: 1,
        firstName:'',
        lastName:'',
        province:'',
        district:'',
        ward:'',
        email:'',
        phoneNumber:'',
        cccd:'',
        gplx:'',
        fileCCCDInputFront:null,
        fileCCCDInputBack:null,
        fileGPLXInputFront:null,
        fileGPLXInputBack:null,
    },
    reducers: {
        updateStep(state, action) {
            state.step = action.payload;
        },
        updateData(state, action) {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.province = action.payload.province;
            state.district = action.payload.district;
            state.ward = action.payload.ward;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.cccd = action.payload.cccd;
            state.gplx = action.payload.gplx;
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