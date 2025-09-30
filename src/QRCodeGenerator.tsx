import React, { useMemo } from 'react';
import { QrCode, Link, MessageSquare, User, Download, Copy, Check } from 'lucide-react';
import useQRCodeGenerator, { type ActiveTab } from './hooks/useQRCodeGenerator';
import { createTranslator, resolveLocale } from './lib/i18n';

const QRCodeGenerator = () => {
  const { t } = useMemo(() => {
    const locale = resolveLocale('{{APP_LOCALE}}');
    return createTranslator(locale);
  }, []);

  const {
    activeTab,
    setActiveTab,
    qrData,
    qrContainerRef,
    copied,
    copyToClipboard,
    urlInput,
    setUrlInput,
    textInput,
    setTextInput,
    contactInfo,
    setContactField,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    foregroundHex,
    setForegroundHex,
    backgroundHex,
    setBackgroundHex,
    handleForegroundHexChange,
    handleBackgroundHexChange,
    handleImageUpload,
    centerImage,
    centerImageFile,
    removeCenterImage,
    customFilename,
    setCustomFilename,
    addTimestamp,
    setAddTimestamp,
    filenamePreview,
    timestampedFilenamePreview,
    downloadQRCode,
    resetForm,
  } = useQRCodeGenerator(t);

  const tabs = useMemo(
    () => [
      { id: 'url' as ActiveTab, label: t('urlTab'), icon: Link },
      { id: 'text' as ActiveTab, label: t('textTab'), icon: MessageSquare },
      { id: 'contact' as ActiveTab, label: t('contactTab'), icon: User },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {t('appTitle')}
          </h1>
          <p className="text-gray-600 text-lg">{t('appDescription')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {activeTab === 'url' && t('enterUrl')}
                  {activeTab === 'text' && t('enterText')}
                  {activeTab === 'contact' && t('contactInformation')}
                </h2>

                {activeTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('websiteUrl')}
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(event) => setUrlInput(event.target.value)}
                      placeholder={t('urlPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('urlHelp')}</p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('textContent')}
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(event) => setTextInput(event.target.value)}
                      placeholder={t('textPlaceholder')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('firstName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(event) => setContactField('firstName', event.target.value)}
                          placeholder={t('firstNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('lastName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(event) => setContactField('lastName', event.target.value)}
                          placeholder={t('lastNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('phoneNumber')}
                        </label>
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(event) => setContactField('phone', event.target.value)}
                          placeholder={t('phonePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('emailAddress')}
                        </label>
                        <input
                          type="email"
                          value={contactInfo.email}
                          onChange={(event) => setContactField('email', event.target.value)}
                          placeholder={t('emailPlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('organization')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.organization}
                          onChange={(event) => setContactField('organization', event.target.value)}
                          placeholder={t('organizationPlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('website')}
                        </label>
                        <input
                          type="url"
                          value={contactInfo.url}
                          onChange={(event) => setContactField('url', event.target.value)}
                          placeholder={t('websitePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">QR Code Customization</h3>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Colors</h4>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Foreground Color (QR Pattern)
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(event) => {
                            const nextColor = event.target.value;
                            setForegroundColor(nextColor);
                            setForegroundHex(nextColor);
                          }}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={foregroundHex}
                          onChange={handleForegroundHexChange}
                          placeholder="#000000"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">Background Color</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(event) => {
                            const nextColor = event.target.value;
                            setBackgroundColor(nextColor);
                            setBackgroundHex(nextColor);
                          }}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundHex}
                          onChange={handleBackgroundHexChange}
                          placeholder="#ffffff"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-md font-medium text-gray-700">Download Settings</h4>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">File Name</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customFilename}
                          onChange={(event) => setCustomFilename(event.target.value)}
                          placeholder="qr-code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          maxLength={50}
                        />
                        <span className="text-sm text-gray-500 font-mono">.png</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="addTimestamp"
                          checked={addTimestamp}
                          onChange={(event) => setAddTimestamp(event.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="addTimestamp" className="text-sm text-gray-600">
                          Add timestamp ({addTimestamp ? timestampedFilenamePreview : filenamePreview})
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {addTimestamp
                          ? 'Timestamp format: MMDD-HHMM (month, day, hour, minute)'
                          : 'Enter a custom name for your downloaded QR code. Special characters will be removed automatically.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-md font-medium text-gray-700">Center Image</h4>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />

                      {centerImage && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img src={centerImage} alt="Center preview" className="w-10 h-10 object-cover rounded border" />
                          <span className="text-sm text-gray-600 flex-1">{centerImageFile?.name || 'Center image'}</span>
                          <button onClick={removeCenterImage} className="text-red-500 hover:text-red-700 text-sm font-medium">
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Upload a small logo or image to display in the center of your QR code. Keep it simple for better scannability.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  {t('clearAllFields')}
                </button>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">{t('generatedQrCode')}</h2>

                <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-sm">
                  {qrData ? (
                    <div className="text-center">
                      <div ref={qrContainerRef} className="flex justify-center" />
                      <p className="text-sm text-gray-600 mt-4">{t('scanQrCode')}</p>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t('fillFormPrompt')}</p>
                    </div>
                  )}
                </div>

                {qrData && (
                  <div className="flex gap-4 w-full max-w-sm">
                    <button
                      onClick={downloadQRCode}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          {t('copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t('copyData')}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {qrData && (
                  <div className="w-full max-w-sm">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{t('qrCodeData')}</h3>
                    <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>{t('footerText')}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
