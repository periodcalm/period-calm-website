'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'

export default function LegalDisclaimer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Small info icon - positioned subtly */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Legal Information"
        aria-label="Legal disclaimers and information"
      >
        <Info size={16} />
      </button>

      {/* Disclaimer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Legal Disclaimers</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Medical Disclaimer</h3>
                  <p>
                    Period Calm is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease. 
                    The information provided on this website is for educational purposes only and should not be considered as medical advice. 
                    Always consult with a qualified healthcare professional before starting any new supplement regimen, especially if you have 
                    underlying health conditions or are taking medications.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Individual Results May Vary</h3>
                  <p>
                    Results and experiences with Period Calm may vary from person to person. The testimonials and reviews featured on this 
                    website represent individual experiences and are not guarantees of similar results. Factors such as individual health, 
                    lifestyle, and adherence to usage instructions may affect outcomes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">FDA Disclaimer</h3>
                  <p>
                    These statements have not been evaluated by the Food and Drug Administration (FDA). This product is not intended to 
                    diagnose, treat, cure, or prevent any disease. Period Calm is marketed as a dietary supplement under the Dietary 
                    Supplement Health and Education Act (DSHEA) of 1994.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Allergen Information</h3>
                  <p>
                    Period Calm contains natural ingredients that may cause allergic reactions in some individuals. Please read the ingredient 
                    list carefully and discontinue use if you experience any adverse reactions. If you have known allergies, consult with 
                    your healthcare provider before use.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pregnancy and Nursing</h3>
                  <p>
                    If you are pregnant, nursing, or trying to conceive, consult with your healthcare provider before using Period Calm. 
                    Some ingredients may not be suitable during pregnancy or while breastfeeding.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Age Restrictions</h3>
                  <p>
                    Period Calm is intended for adult women. Do not use if you are under 18 years of age without parental consent and 
                    medical supervision.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Terms of Use</h3>
                  <p>
                    By using this website and purchasing Period Calm, you acknowledge that you have read, understood, and agree to these 
                    disclaimers. We reserve the right to modify these disclaimers at any time.
                  </p>
                </div>

                <div className="text-xs text-gray-500 mt-6 pt-4 border-t">
                  <p>
                    <strong>Last Updated:</strong> August 1, 2025<br />
                    <strong>Contact:</strong> For questions about these disclaimers, please contact us through our website.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 