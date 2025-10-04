import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Percent, User, GitBranch, Settings } from 'lucide-react';

export default function ApprovalRulesPage() {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Standard Approval',
      type: 'SEQUENTIAL',
      description: 'Manager → Finance → Director',
      active: true
    },
    {
      id: 2,
      name: 'High Value Expenses',
      type: 'HYBRID',
      description: 'CFO auto-approves OR 60% consensus',
      active: true
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [ruleData, setRuleData] = useState({
    name: '',
    description: '',
    type: 'SEQUENTIAL',
    minAmount: '',
    maxAmount: '',
    isManagerRequired: true,
    approvers: [],
    percentageThreshold: 60,
    specificApproverId: '',
    hybridLogic: 'OR'
  });

  const [approverSteps, setApproverSteps] = useState([
    { step: 1, role: '', approverIds: [] }
  ]);

  const availableUsers = [
    { id: 'u1', name: 'Bastav Dutta', role: 'ADMIN' },
    { id: 'u2', name: 'Sarah Smith', role: 'MANAGER' },
    { id: 'u3', name: 'John Doe', role: 'ADMIN' },
    { id: 'u4', name: 'Mike Johnson', role: 'EMPLOYEE' },
    { id: 'u5', name: 'Emma Wilson', role: 'EMPLOYEE' },
    { id: 'u6', name: 'David Brown (CFO)', role: 'ADMIN' }
  ];

  const getRuleTypeIcon = (type) => {
    const icons = {
      SEQUENTIAL: GitBranch,
      PERCENTAGE: Percent,
      SPECIFIC_APPROVER: User,
      HYBRID: Settings
    };
    return icons[type] || GitBranch;
  };

  const addApproverStep = () => {
    setApproverSteps([...approverSteps, {
      step: approverSteps.length + 1,
      role: '',
      approverIds: []
    }]);
  };

  const removeApproverStep = (stepIndex) => {
    setApproverSteps(approverSteps.filter((_, i) => i !== stepIndex));
  };

  const updateApproverStep = (index, field, value) => {
    const updated = [...approverSteps];
    updated[index][field] = value;
    setApproverSteps(updated);
  };

  const handleCreateRule = () => {
    const newRule = {
      id: rules.length + 1,
      name: ruleData.name,
      type: ruleData.type,
      description: generateDescription(),
      active: true
    };
    setRules([...rules, newRule]);
    setShowCreateModal(false);
    resetForm();
    alert('Approval rule created successfully!');
  };

  const generateDescription = () => {
    if (ruleData.type === 'SEQUENTIAL') {
      return `${approverSteps.length} step approval flow`;
    } else if (ruleData.type === 'PERCENTAGE') {
      return `${ruleData.percentageThreshold}% approver consensus required`;
    } else if (ruleData.type === 'SPECIFIC_APPROVER') {
      return `Auto-approved by specific approver`;
    } else {
      return `Hybrid: ${ruleData.hybridLogic} logic`;
    }
  };

  const resetForm = () => {
    setRuleData({
      name: '',
      description: '',
      type: 'SEQUENTIAL',
      minAmount: '',
      maxAmount: '',
      isManagerRequired: true,
      approvers: [],
      percentageThreshold: 60,
      specificApproverId: '',
      hybridLogic: 'OR'
    });
    setApproverSteps([{ step: 1, role: '', approverIds: [] }]);
    setCurrentStep(1);
  };

  const deleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(r => r.id !== ruleId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approval Rules</h1>
          <p className="text-gray-600 mt-1">Configure approval workflows for expense processing</p>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Approval Rule
          </button>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => {
            const Icon = getRuleTypeIcon(rule.type);
            return (
              <div key={rule.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-500 uppercase">{rule.type}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Rule Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Approval Rule</h2>
                <p className="text-sm text-gray-600 mt-1">Step {currentStep} of 3</p>
              </div>

              {/* Progress Bar */}
              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    Basic Info
                  </span>
                  <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    Rule Type
                  </span>
                  <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    Configuration
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                      <input
                        type="text"
                        value={ruleData.name}
                        onChange={(e) => setRuleData({...ruleData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., High Value Approval"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={ruleData.description}
                        onChange={(e) => setRuleData({...ruleData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        placeholder="Describe when this rule applies..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Amount (Optional)
                        </label>
                        <input
                          type="number"
                          value={ruleData.minAmount}
                          onChange={(e) => setRuleData({...ruleData, minAmount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Amount (Optional)
                        </label>
                        <input
                          type="number"
                          value={ruleData.maxAmount}
                          onChange={(e) => setRuleData({...ruleData, maxAmount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Rule Type Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">Select the type of approval workflow:</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'SEQUENTIAL', icon: GitBranch, label: 'Sequential', desc: 'Multi-step approval flow' },
                        { value: 'PERCENTAGE', icon: Percent, label: 'Percentage', desc: 'X% of approvers must approve' },
                        { value: 'SPECIFIC_APPROVER', icon: User, label: 'Specific Approver', desc: 'Auto-approve by one person' },
                        { value: 'HYBRID', icon: Settings, label: 'Hybrid', desc: 'Combine multiple conditions' }
                      ].map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.value}
                            onClick={() => setRuleData({...ruleData, type: type.value})}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              ruleData.type === type.value
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mb-2 ${
                              ruleData.type === type.value ? 'text-indigo-600' : 'text-gray-400'
                            }`} />
                            <h4 className="font-semibold text-gray-900">{type.label}</h4>
                            <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Configuration */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* SEQUENTIAL Configuration */}
                    {ruleData.type === 'SEQUENTIAL' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="checkbox"
                            checked={ruleData.isManagerRequired}
                            onChange={(e) => setRuleData({...ruleData, isManagerRequired: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            Require manager approval first
                          </label>
                        </div>

                        <div className="space-y-3">
                          {approverSteps.map((step, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-gray-900">Step {step.step}</span>
                                {index > 0 && (
                                  <button
                                    onClick={() => removeApproverStep(index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role/Department
                                  </label>
                                  <input
                                    type="text"
                                    value={step.role}
                                    onChange={(e) => updateApproverStep(index, 'role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Finance, Director"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Approver(s)
                                  </label>
                                  <select
                                    multiple
                                    value={step.approverIds}
                                    onChange={(e) => {
                                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                                      updateApproverStep(index, 'approverIds', selected);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    size="3"
                                  >
                                    {availableUsers.map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.name} ({user.role})
                                      </option>
                                    ))}
                                  </select>
                                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={addApproverStep}
                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                          >
                            + Add Another Step
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PERCENTAGE Configuration */}
                    {ruleData.type === 'PERCENTAGE' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Approval Threshold (%)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={ruleData.percentageThreshold}
                            onChange={(e) => setRuleData({...ruleData, percentageThreshold: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            {ruleData.percentageThreshold}% of selected approvers must approve
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Approvers
                          </label>
                          <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                            {availableUsers.map((user) => (
                              <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={user.id}
                                  checked={ruleData.approvers.includes(user.id)}
                                  onChange={(e) => {
                                    const newApprovers = e.target.checked
                                      ? [...ruleData.approvers, user.id]
                                      : ruleData.approvers.filter(id => id !== user.id);
                                    setRuleData({...ruleData, approvers: newApprovers});
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.role}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                          
                          {ruleData.approvers.length > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>{ruleData.approvers.length}</strong> approver(s) selected. 
                                Need <strong>{Math.ceil((ruleData.percentageThreshold / 100) * ruleData.approvers.length)}</strong> approval(s) 
                                ({ruleData.percentageThreshold}% of {ruleData.approvers.length})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SPECIFIC_APPROVER Configuration */}
                    {ruleData.type === 'SPECIFIC_APPROVER' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Specific Approver(s)
                          </label>
                          <p className="text-sm text-gray-600 mb-3">
                            If any of these people approve, the expense is automatically approved
                          </p>
                          
                          <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                            {availableUsers.map((user) => (
                              <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={user.id}
                                  checked={ruleData.approvers.includes(user.id)}
                                  onChange={(e) => {
                                    const newApprovers = e.target.checked
                                      ? [...ruleData.approvers, user.id]
                                      : ruleData.approvers.filter(id => id !== user.id);
                                    setRuleData({...ruleData, approvers: newApprovers});
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.role}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                          
                          {ruleData.approvers.length > 0 && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-800">
                                <strong>{ruleData.approvers.length}</strong> approver(s) selected. 
                                Any of them can auto-approve the expense.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* HYBRID Configuration */}
                    {ruleData.type === 'HYBRID' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition Logic
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="hybridLogic"
                                value="OR"
                                checked={ruleData.hybridLogic === 'OR'}
                                onChange={(e) => setRuleData({...ruleData, hybridLogic: e.target.value})}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className="text-sm text-gray-700">OR (any condition satisfied)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="hybridLogic"
                                value="AND"
                                checked={ruleData.hybridLogic === 'AND'}
                                onChange={(e) => setRuleData({...ruleData, hybridLogic: e.target.value})}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className="text-sm text-gray-700">AND (all conditions required)</span>
                            </label>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">Condition 1: Specific Approver(s)</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Select people who can individually approve
                          </p>
                          <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                            {availableUsers.map((user) => (
                              <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={user.id}
                                  checked={(ruleData.approvers || []).includes(user.id)}
                                  onChange={(e) => {
                                    const currentApprovers = ruleData.approvers || [];
                                    const newApprovers = e.target.checked
                                      ? [...currentApprovers, user.id]
                                      : currentApprovers.filter(id => id !== user.id);
                                    setRuleData({...ruleData, approvers: newApprovers});
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.role}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="text-center text-sm font-medium text-gray-500">
                          {ruleData.hybridLogic}
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">Condition 2: Percentage Consensus</h4>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Threshold (%)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={ruleData.percentageThreshold}
                              onChange={(e) => setRuleData({...ruleData, percentageThreshold: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Approvers for Percentage
                            </label>
                            <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                              {availableUsers.map((user) => (
                                <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    value={user.id}
                                    checked={(ruleData.approvers || []).includes(user.id)}
                                    onChange={(e) => {
                                      const currentApprovers = ruleData.approvers || [];
                                      const newApprovers = e.target.checked
                                        ? [...currentApprovers, user.id]
                                        : currentApprovers.filter(id => id !== user.id);
                                      setRuleData({...ruleData, approvers: newApprovers});
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.role}</div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Example:</strong> Expense will be approved if{' '}
                            {ruleData.hybridLogic === 'OR' ? 'either' : 'both'}{' '}
                            the specific approver approves {ruleData.hybridLogic === 'OR' ? 'OR' : 'AND'}{' '}
                            {ruleData.percentageThreshold}% of selected approvers approve.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (currentStep < 3) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      handleCreateRule();
                    }
                  }}
                  className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {currentStep === 3 ? 'Create Rule' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}