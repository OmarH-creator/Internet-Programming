import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../services/userService";
import UpdateEmailModal from "../modals/updateEmailModal";
import UpdatePhoneNumberModal from "../modals/updatePhoneNumberModal";
import VerifyPhonePasswordModal from "../modals/verifyPhonePasswordModal";
import ChangePasswordModal from "../modals/changePasswordModal";
import GenderModal from "../modals/genderModal";
import DeleteAccountModal from "../modals/deleteAccountModal";
import { useNavigate } from "react-router-dom";
import {
	SettingsSection,
	SettingsRowChevron,
	SettingsRowAction,
	SettingsRowToggle,
	SettingsRowExternal
} from "../SettingsShared";

export default function AccountTab() {
	const { user, updateUser, logout } = useAuth();
	const navigate = useNavigate();

	const [emailModalOpen, setEmailModalOpen] = useState(false);
	const [emailLoading, setEmailLoading] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [phonePasswordModalOpen, setPhonePasswordModalOpen] = useState(false);
	const [phoneModalOpen, setPhoneModalOpen] = useState(false);
	const [phoneLoading, setPhoneLoading] = useState(false);
	const [phoneError, setPhoneError] = useState("");
	const [phonePassword, setPhonePassword] = useState("");
	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
	const [changePasswordLoading, setChangePasswordLoading] = useState(false);
	const [changePasswordError, setChangePasswordError] = useState("");
	const [genderModalOpen, setGenderModalOpen] = useState(false);
	const [genderLoading, setGenderLoading] = useState(false);
	const [genderError, setGenderError] = useState("");
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState("");

	const handleOpenEmailModal = () => {
		setEmailError("");
		setEmailModalOpen(true);
	};

	const handleCloseEmailModal = () => {
		if (emailLoading) return;
		setEmailModalOpen(false);
		setEmailError("");
	};

	const handleSubmitEmail = async ({ email, password }) => {
		try {
			setEmailLoading(true);
			setEmailError("");

			const response = await userService.updateAccount({ email, password });

			const updatedUser =
				response?.data?.data?.user ||
				response?.data?.user ||
				null;

			if (updatedUser) {
				updateUser(updatedUser);
			} else {
				updateUser({ email });
			}

			setEmailModalOpen(false);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Could not update email. Please try again.";
			setEmailError(message);
		} finally {
			setEmailLoading(false);
		}
	};

	const handleOpenPhoneNumberModal = () => {
		setPhoneError("");
		setPhonePassword("");
		setPhoneModalOpen(false);
		setPhonePasswordModalOpen(true);
	};

	const handleClosePhonePasswordModal = () => {
		if (phoneLoading) return;
		setPhonePasswordModalOpen(false);
		setPhoneError("");
		setPhonePassword("");
	};

	const handleSubmitPhonePassword = async (password) => {
		try {
			setPhoneLoading(true);
			setPhoneError("");

			await userService.verifyPassword({ password });

			setPhonePassword(password);
			setPhonePasswordModalOpen(false);
			setPhoneModalOpen(true);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Password verification failed. Please try again.";
			setPhoneError(message);
		} finally {
			setPhoneLoading(false);
		}
	};

	const handleClosePhoneNumberModal = () => {
		if (phoneLoading) return;
		setPhoneModalOpen(false);
		setPhoneError("");
		setPhonePassword("");
	};

	const handleSubmitPhoneNumber = async (phoneNumber) => {
		try {
			setPhoneLoading(true);
			setPhoneError("");

			const response = await userService.updatePhoneNumber({
				phoneNumber,
				password: phonePassword
			});

			const updatedUser =
				response?.data?.data?.user ||
				response?.data?.user ||
				null;

			if (updatedUser) {
				updateUser(updatedUser);
			} else {
				updateUser({ phoneNumber });
			}

			setPhoneModalOpen(false);
			setPhonePassword("");
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Could not update phone number. Please try again.";
			setPhoneError(message);
		} finally {
			setPhoneLoading(false);
		}
	};

	const handleOpenChangePasswordModal = () => {
		setChangePasswordError("");
		setChangePasswordModalOpen(true);
	};

	const handleCloseChangePasswordModal = () => {
		if (changePasswordLoading) return;
		setChangePasswordModalOpen(false);
		setChangePasswordError("");
	};

	const handleSubmitChangePassword = async ({ currentPassword, newPassword }) => {
		try {
			setChangePasswordLoading(true);
			setChangePasswordError("");

			await userService.changePassword({ currentPassword, newPassword });

			setChangePasswordModalOpen(false);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Could not change password. Please try again.";
			setChangePasswordError(message);
		} finally {
			setChangePasswordLoading(false);
		}
	};

	const handleOpenGenderModal = () => {
		setGenderError("");
		setGenderModalOpen(true);
	};

	const handleCloseGenderModal = () => {
		if (genderLoading) return;
		setGenderModalOpen(false);
		setGenderError("");
	};

	const handleSubmitGender = async ({ gender }) => {
		try {
			setGenderLoading(true);
			setGenderError("");

			const response = await userService.updateProfile({ gender });

			const updatedUser =
				response?.data?.data?.user ||
				response?.data?.user ||
				null;

			if (updatedUser) {
				updateUser(updatedUser);
			} else {
				updateUser({ gender });
			}

			setGenderModalOpen(false);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Could not update gender. Please try again.";
			setGenderError(message);
		} finally {
			setGenderLoading(false);
		}
	};

	const handleOpenDeleteModal = () => {
		setDeleteError("");
		setDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		if (deleteLoading) return;
		setDeleteModalOpen(false);
		setDeleteError("");
	};

	const handleSubmitDeleteAccount = async ({ password }) => {
		try {
			setDeleteLoading(true);
			setDeleteError("");

			await userService.deleteAccount({ password });
			await logout();
			navigate("/");
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				"Could not delete account. Please try again.";
			setDeleteError(message);
		} finally {
			setDeleteLoading(false);
		}
	};

	return (
		<>
			<SettingsSection title="General">
				<SettingsRowChevron
					label="Email address"
					value={user?.email ?? ""}
					onClick={handleOpenEmailModal}
				/>
				<SettingsRowChevron 
					label="Phone Number"
					value={user?.phoneNumber || "Not Added"}
					onClick={handleOpenPhoneNumberModal}
				/>
				<SettingsRowChevron label="Password" onClick={handleOpenChangePasswordModal} />
				<SettingsRowChevron
					label="Gender"
					value={user?.gender || "Not specified"}
					onClick={handleOpenGenderModal}
				/>
				<SettingsRowChevron
					label="Location customization"
					value="No location specified"
					onClick={() => {}}
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Account authorization">
				<SettingsRowAction
					label="Google"
					sub="Connect to log in to Reddit with your Google account"
					actionLabel="Connect"
					onClick={() => {}}
				/>
				<SettingsRowAction
					label="Apple"
					sub="Connect to log in to Reddit with your Apple account"
					actionLabel="Connect"
					onClick={() => {}}
				/>
				<SettingsRowToggle
					label="Two-factor authentication"
					defaultChecked={false}
					onChange={() => {}}
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Apps">
				<SettingsRowChevron label="App settings" onClick={() => {}} />
				<SettingsRowExternal
					label="Learn about Developer Platform"
					href="https://developers.reddit.com"
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Reddit Premium">
				<SettingsRowChevron label="Get premium" onClick={() => {}} divider={false} />
			</SettingsSection>

			<SettingsSection title="Advanced">
				<SettingsRowChevron label="Delete account" onClick={handleOpenDeleteModal} divider={false} />
			</SettingsSection>

			<UpdateEmailModal
				open={emailModalOpen}
				onClose={handleCloseEmailModal}
				currentEmail={user?.email ?? ""}
				onSubmit={handleSubmitEmail}
				loading={emailLoading}
				serverError={emailError}
			/>

			<VerifyPhonePasswordModal
				open={phonePasswordModalOpen}
				onClose={handleClosePhonePasswordModal}
				onSubmit={handleSubmitPhonePassword}
				loading={phoneLoading}
				serverError={phoneError}
			/>

			<UpdatePhoneNumberModal
				open={phoneModalOpen}
				onClose={handleClosePhoneNumberModal}
				currentPhoneNumber={user?.phoneNumber ?? ""}
				onContinue={handleSubmitPhoneNumber}
				loading={phoneLoading}
				serverError={phoneError}
			/>

			<ChangePasswordModal
				open={changePasswordModalOpen}
				onClose={handleCloseChangePasswordModal}
				onSubmit={handleSubmitChangePassword}
				loading={changePasswordLoading}
				serverError={changePasswordError}
			/>

			<GenderModal
				open={genderModalOpen}
				onClose={handleCloseGenderModal}
				currentGender={user?.gender || ""}
				onSubmit={handleSubmitGender}
				loading={genderLoading}
				serverError={genderError}
			/>

			<DeleteAccountModal
				open={deleteModalOpen}
				onClose={handleCloseDeleteModal}
				currentUsername={user?.username ?? ""}
				onSubmit={handleSubmitDeleteAccount}
				loading={deleteLoading}
				serverError={deleteError}
			/>
		</>
	);
}