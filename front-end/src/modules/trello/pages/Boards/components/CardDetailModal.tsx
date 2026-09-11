import React, { useState, useEffect } from 'react';
import { Card, Member } from '../../../interfaces/BoardInterface';

interface CardDetailModalProps {
	card: Card;
	isOpen: boolean;
	onClose: () => void;
	onSave: (updates: Partial<Card>) => void;
}

// Mock members available in the project
const MOCK_MEMBERS: Member[] = [
	{ id: 'm1', name: 'Nam Pham', avatar: 'https://avatars.githubusercontent.com/u/1?v=4' },
	{ id: 'm2', name: 'John Doe', avatar: 'https://avatars.githubusercontent.com/u/2?v=4' },
	{ id: 'm3', name: 'Jane Smith', avatar: 'https://avatars.githubusercontent.com/u/3?v=4' },
];

export const CardDetailModal = ({ card, isOpen, onClose, onSave }: CardDetailModalProps) => {
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || '');
	const [startDate, setStartDate] = useState(card.startDate || '');
	const [endDate, setEndDate] = useState(card.endDate || '');
	const [selectedMembers, setSelectedMembers] = useState<Member[]>(card.members || []);

	useEffect(() => {
		if (isOpen) {
			setTitle(card.title);
			setDescription(card.description || '');
			setStartDate(card.startDate || '');
			setEndDate(card.endDate || '');
			setSelectedMembers(card.members || []);
		}
	}, [isOpen, card]);

	if (!isOpen) return null;

	const handleSave = () => {
		onSave({
			title,
			description,
			startDate,
			endDate,
			members: selectedMembers
		});
		onClose();
	};

	const toggleMember = (member: Member) => {
		const exists = selectedMembers.find(m => m.id === member.id);
		if (exists) {
			setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
		} else {
			setSelectedMembers([...selectedMembers, member]);
		}
	};

	// A very basic contentEditable rich text alternative
	const execCommand = (command: string) => {
		document.execCommand(command, false, '');
	};

	return (
		<>
			<div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
			<div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header border-0 pb-0">
							<div className="w-100 d-flex align-items-center">
								<i className="bi bi-card-heading fs-5 me-2 text-muted"></i>
								<input
									type="text"
									className="form-control fw-bold fs-5 border-0 px-1 py-0 shadow-none"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									style={{ backgroundColor: 'transparent' }}
								/>
							</div>
							<button type="button" className="btn-close" onClick={onClose}></button>
						</div>
						<div className="modal-body pt-3">
							<div className="row">
								<div className="col-md-9">
									{/* Members & Dates */}
									<div className="d-flex flex-wrap gap-4 mb-4">
										{/* Members */}
										<div>
											<h6 className="text-muted fs-8 fw-semibold mb-2">Members</h6>
											<div className="d-flex align-items-center gap-1 flex-wrap">
												{selectedMembers.map(m => (
													<div key={m.id} className="avatar-circle" title={m.name} style={{ width: '32px', height: '32px' }}>
														<img src={m.avatar} alt={m.name} className="w-100 h-100 rounded-circle" />
													</div>
												))}
												<div className="dropdown">
													<button className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} data-bs-toggle="dropdown">
														<i className="bi bi-plus"></i>
													</button>
													<ul className="dropdown-menu shadow-sm">
														<li><h6 className="dropdown-header">Assign members</h6></li>
														{MOCK_MEMBERS.map(m => {
															const isSelected = selectedMembers.some(sm => sm.id === m.id);
															return (
																<li key={m.id}>
																	<button className="dropdown-item d-flex align-items-center gap-2" onClick={() => toggleMember(m)}>
																		<img src={m.avatar} alt={m.name} className="rounded-circle" style={{ width: '24px', height: '24px' }} />
																		<span>{m.name}</span>
																		{isSelected && <i className="bi bi-check2 ms-auto"></i>}
																	</button>
																</li>
															);
														})}
													</ul>
												</div>
											</div>
										</div>

										{/* Dates */}
										<div>
											<h6 className="text-muted fs-8 fw-semibold mb-2">Dates</h6>
											<div className="d-flex align-items-center gap-2">
												<input type="date" className="form-control form-control-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
												<span className="text-muted">-</span>
												<input type="date" className="form-control form-control-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
											</div>
										</div>
									</div>

									{/* Description */}
									<div className="mb-4">
										<div className="d-flex align-items-center gap-2 mb-2">
											<i className="bi bi-justify-left fs-5 text-muted"></i>
											<h6 className="m-0 fw-semibold">Description</h6>
										</div>
										<div className="ps-4">
											{/* Basic Rich Text Editor Toolbar */}
											<div className="border border-bottom-0 rounded-top bg-light p-1 d-flex gap-1">
												<button className="btn btn-sm btn-light p-1 px-2" onClick={() => execCommand('bold')} title="Bold"><i className="bi bi-type-bold"></i></button>
												<button className="btn btn-sm btn-light p-1 px-2" onClick={() => execCommand('italic')} title="Italic"><i className="bi bi-type-italic"></i></button>
												<button className="btn btn-sm btn-light p-1 px-2" onClick={() => execCommand('underline')} title="Underline"><i className="bi bi-type-underline"></i></button>
											</div>
											<div
												className="form-control rounded-bottom rounded-top-0 border shadow-none"
												contentEditable
												style={{ minHeight: '100px', backgroundColor: '#f7f8f9' }}
												onBlur={(e) => setDescription(e.currentTarget.innerHTML)}
												dangerouslySetInnerHTML={{ __html: description }}
											></div>
											<div className="form-text fs-8 mt-1 text-muted">Note: Real project should install react-quill or ckeditor-react.</div>
										</div>
									</div>
								</div>
								
								{/* Sidebar Actions */}
								<div className="col-md-3">
									<h6 className="text-muted fs-8 fw-semibold mb-2">Add to card</h6>
									<div className="d-flex flex-column gap-2">
										<button className="btn btn-light btn-sm text-start"><i className="bi bi-person me-2"></i> Members</button>
										<button className="btn btn-light btn-sm text-start"><i className="bi bi-tag me-2"></i> Labels</button>
										<button className="btn btn-light btn-sm text-start"><i className="bi bi-clock me-2"></i> Dates</button>
										<button className="btn btn-light btn-sm text-start"><i className="bi bi-paperclip me-2"></i> Attachment</button>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer border-0">
							<button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
